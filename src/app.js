const {asciiArt, color} = require("./utils/aesthetic");
const ConfigManager = require('./utils/config');
const {RedisStore, MemoryStore} = require("./utils/store");

const multer  = require('multer');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require("fs");
const path = require('path')

const app = express()

app.locals.configManager = new ConfigManager(path.join(__dirname, "../", 'config.yaml'), app);

async function afterConfig() {

    let store = undefined;

    switch (app.locals.config.store){
        case 'redis':
            const redis = require("redis");
            store = require("rate-limit-redis");

            const client = redis.createClient({
                socket: {
                    host: app.locals.config.redis.host,
                    port: app.locals.config.redis.port,
                },
                password: app.locals.config.redis.password,
                username: app.locals.config.redis.username,
                database: app.locals.config.redis.database,
            });

            await client.connect();

            app.locals.store = new RedisStore(client, app.locals.config);
            app.locals.rateLimitStore = new store({sendCommand: (...args) => app.locals.store.client.sendCommand(args)})

            break;
        default:
            app.locals.store = new MemoryStore(app.locals.config);
    }

    const storage = multer.diskStorage({
        limits:{
            fileSize: app.locals.config['max_upload_file_size']
        },
        destination: path.join(__dirname, 'tmp'),
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    })
    app.locals.multerUpload = multer({storage: storage})
}
afterConfig().then(() => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        app.locals.config['static_path'],
        express.static(__dirname + '/public',{fallthrough: false, redirect:false})
    );
    app.locals.sessions = {};

    const authMiddlewares = require('./middlewares/auth.middleware');
    app.use(authMiddlewares.auth);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');
    app.set('trust proxy', app.locals.config.proxies);

    app.use(require('./routes/auth.route')(app));
    app.use(require('./routes/management.route')(app));
    app.use(require('./routes/index.route'));
    app.use(require('./middlewares/error.middleware'));
    let server = null;
    if (app.locals.config['protocol'] === "https"){
        let https = require('https');
        if (!(app.locals.config['private_key'] && app.locals.config['private_key'])){
            throw new Error("when using https you must provide private_key and certificate to your configuration")
        }
        let privateKey  = fs.readFileSync(app.locals.config['private_key'], 'utf8');
        let certificate = fs.readFileSync(app.locals.config['certificate'], 'utf8');
        let credentials = {key: privateKey, cert: certificate}
        server = https.createServer(credentials, app);
    } else {
        let http = require('http');
        server = http.createServer(app);
    }

    server.listen(app.locals.config.port, app.locals.config['listen-address'],() => {
        console.log(
            `\n${asciiArt}\n\n` +
            `${color.green}Listening on port ${color.red}${app.locals.config.port}${color.white}`
        );
    });
});

