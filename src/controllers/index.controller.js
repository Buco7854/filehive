const {HttpError} = require("../utils/errors");
const {getPermissionsFor, toHumanSize} = require("../utils/helpers");
const path = require('path');

async function index(req, res, next) {
    try {
        // If there is a slash at the beginning it means the user provided 2 /, so we redirect to the sanitized path
        const permissions = getPermissionsFor(
            req.app.locals.config,
            res.locals.path,
            res.locals.userSession ? res.locals.userSession['username'] : null
        );
        if ((res.locals.entity.isFile() && !permissions.autoindex) || (!permissions.autoindex && !permissions.upload)){
            res.locals.isJson = res.locals.entity.isFile();
            if (!res.locals.userSession){
                if (!req.get("Origin") && req.path !== "/favicon.ico"){
                    res.cookie("lastVisited", req.originalUrl, {overwrite:true});
                }
                return next(new HttpError((401)))
            }
            return next(new HttpError(403))
        }

        if (!req.get("Origin") && req.path !== "/favicon.ico"){
            res.cookie("lastVisited", req.originalUrl, {overwrite:true});
        }

        if (res.locals.entity.isFile()){
            if (req.app.locals.config["proxies"].length > 0){
                res.status(200).json({"detail":"ok"});
            }
            else{
                res.sendFile(path.resolve(path.join(req.app.locals.config['dir'], res.locals.path)));
            }
        }
        else{
            res.locals.entity.content = res.locals.entity.content.filter(
                e => {return permissions['show_hidden'] ? permissions['autoindex'] : !e.name.startsWith('.') && permissions['autoindex']}
            );
            res.render('index/index', {
                title: res.locals.path,
                directory: res.locals.entity,
                toHumanSize : toHumanSize,
            })
        }
    } catch (err) {
        next(err);
    }
}
module.exports = {
    index
};