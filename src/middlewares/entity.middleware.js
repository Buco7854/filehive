const fs = require("fs");
const {HttpError} = require("../utils/errors");
const {sortArrayOfDict, sanitizePath} = require("../utils/helpers")
const path = require('path')

function entityMiddleware(req, res, next) {
    res.locals.path = sanitizePath(req.params.path);
    if ("/"+ req.params.path !== res.locals.path) {
        return res.redirect(301, res.locals.path)
    }
    fs.stat(path.join(req.app.locals.config['dir'],res.locals.path), async (err, entity) => {
            try {
                if (err) {
                    if (err.code === "ENOENT" || err.code === "ENOTDIR") {
                        return next(new HttpError(404))
                    }
                    return next(err);
                }
                res.locals.entity = entity;

                let parent = path.dirname("/theRoot/" + res.locals.path)
                if (parent === "/") {
                    parent = null;
                } else if (parent === "/theRoot") {
                    parent = "/"
                }
                res.locals.entity.parent = parent;
                res.locals.entity.name = path.basename(res.locals.path);

                if (res.locals.entity.isDirectory()) {
                    let files = await fs.promises.readdir(path.join(req.app.locals.config['dir'], res.locals.path), {withFileTypes: true})

                    let tempFiles = [];
                    let tempDirectories = [];

                    for (let f of files) {
                        try {
                            let entity = await fs.promises.stat(path.join(req.app.locals.config['dir'], res.locals.path, f.name), {withFileTypes: true})
                            entity.name = f.name
                            entity.symbolicLink = f.isSymbolicLink()

                            if (entity.isDirectory()) {
                                tempDirectories.push(entity)
                            }
                            else if (entity.isFile()) {
                                tempFiles.push(entity)
                            }
                        }
                        catch(err){
                            // Some weird hidden folders on windows
                            if(err.code === "ENOENT"){
                                continue
                            }
                            return next(err)
                        }
                    }

                    res.locals.entity.content = [].concat(
                        sortArrayOfDict(tempDirectories, "name"),
                        sortArrayOfDict(tempFiles, "name"),
                    )
                }
                next()
            } catch (err) {
                next(err)
            }
        }
    )
}
module.exports = {
    entityMiddleware
}