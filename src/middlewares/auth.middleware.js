const rateLimit = require('express-rate-limit')

async function auth(req, res, next){
    res.locals.userSession = null;
    try{
        if (!req.cookies) {
            return next();
        }

        const sessionToken = req.cookies[req.app.locals.config['cookie_key']]

        if (!sessionToken) {
            return next();
        }
        const userSession = await req.app.locals.store.get("sessions:" + sessionToken);
        if (!userSession) {
            res.cookie(req.app.locals.config['cookie_key'], "", { maxAge: 0 })
            return next();
        }
        res.locals.userSession = userSession;
        next();
    } catch(err){
        next(err)
    }
}

function loginLimiter(app) {
    return rateLimit({
        message : "Too many attempt! You have been suspended.",
        windowMs:  7 * 24 * 60 * 60 * 1000, // allow 20 password mistake in a week per ip (depending on KeyGenerator),
        max: 20,
        standardHeaders: true,
        legacyHeaders: true,
        skipSuccessfulRequests : true,
        keyGenerator: (req, res) => req.ip, // if you wish to edit you could also do req.body['username'], your choice (intentional spamming may block your account).
        handler: (req, res, next, options) =>
        {
            res.status(options.statusCode).json({"detail":options.message})
        },
        store: app.locals.rateLimitStore
    })
}
module.exports = {
    auth,
    loginLimiter
}