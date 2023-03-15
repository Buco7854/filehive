const fs = require('fs');
const yaml = require('js-yaml');
const {validateConfiguration} = require("./validation");
const path = require('path')

module.exports = class ConfigManager{
    constructor(filePath, app) {
        this.filePath = filePath;
        this.app = app;
        this.config = null;
        this.locked = false;
        this.init()
    }

    loadConfig(update, retry) {
        try{
            if(!retry){
                retry = 0
            }
            this.config = yaml.load(
                fs.readFileSync(this.filePath, 'utf8')
            );
            if (this.config === undefined){
                // Weird bug, yaml.load() sometimes returns undefined, so if its the case we try later
                if (retry <= 5){
                    setTimeout(() => {
                        this.loadConfig(true, retry + 1)
                    }, 2000)
                }

                return false
            }
            this.app.locals.config = validateConfiguration(this.config);
            this.app.locals.config['dir'] = path.normalize(this.app.locals.config['dir'])
            this.app.locals.config['static_path'] = path.normalize(this.app.locals.config['static_path'])
            this.app.locals.config['delete_path'] = path.normalize(this.app.locals.config['delete_path'])
            this.app.locals.config['create_folder_path'] = path.normalize(this.app.locals.config['create_folder_path'])
            this.app.locals.config['upload_path'] = path.normalize(this.app.locals.config['upload_path'])

        } catch (e){
            if(!update){
                throw e
            }
        }

    };

    init(){
        this.loadConfig()
        fs.watch(this.filePath, (event, filename) => {
            // fs.watch is sometimes fired multiple times, so we use a lock to avoid loading the configuration twice.
            if (this.locked){
                return
            }
            this.locked = true
            if (!filename || event !== "change" || !this.filePath.endsWith(filename)) {
                return
            }
            this.loadConfig(true)
            // unlocking the lock
            setTimeout(() => {this.locked = false}, 500)
        })
    }
}
