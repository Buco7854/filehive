const {getPermissionsFor, sanitizePath} = require("../utils/helpers");
const {HttpError} = require("../utils/errors");
const fs = require("fs");
const path = require('path');

async function uploadForm(req, res, next){
    try{
        if (typeof req.body?.path !== 'string'){
            return next(new HttpError(400, "path is a required field and must be string"));
        }
        if (!req.files || req.files.length < 1){
            return next(new HttpError(400, "at least one file is required"));
        }
        // I don't know if it can be faked but better be safe than sorry.
        for (const e of req.files){
            if (e.originalname.includes('/') || e.originalname === '..' || e.originalname === '.'){
                return next(new HttpError(400, `Error at files : '${e}', files names cannot contains '/'.`))
            }
        }
        req.body.path = sanitizePath(req.body.path)

        const permissions = getPermissionsFor(
            req.app.locals.config,
            req.body.path,
            res.locals.userSession ? res.locals.userSession['username'] : null
        );
        if (!permissions.upload){
            if (!res.locals.userSession){
                return next(new HttpError(401));
            }
            return next(new HttpError(403));
        }

        for (const file of req.files){
            try{
                // We check if file exist, if it does the file does not exist
                await fs.promises.access(path.join(req.app.locals.config['dir'], req.body.path, file.originalname))
                // We check if user has read permission, read + write allows deletion, so he can overwrite the file, otherwise we cancel the upload.
                if(!permissions.autoindex || (file.originalname.startsWith('.') && !permissions['show_hidden'])){
                    return next(new HttpError(403, "Sorry, we could not upload your file because a file with the same name already exists. Make sur you have the 'autoindex' permission if you wish to overwrite it. Additionally, if you are trying to upload a file starting with a dot (which is a hidden file), please ensure that you have the 'show hidden' permission."));
                }
            } catch(err) {
                if (!err.code?.includes('ENO')){
                    return next(err)
                }
            }
            await fs.promises.rename(file.path, path.join(req.app.locals.config['dir'] + "/" + req.body.path + "/" +file.originalname))
        }
        res.status(200).json({"detail":"ok"});
    } catch (err){
        next(err);
    }
}

async function deleteForm(req, res, next){
    try{
        if (typeof req.body?.path !== 'string'){
            return next(new HttpError(400, "path is a required field and must be string"));
        }
        if (!req.body?.entities?.length){
            return next(new HttpError(400, "entities is a required field."));
        }
        for (const e of req.body.entities){
            if (e.includes('/' || e === '..' || e === '.')){
                return next(new HttpError(400, `Error at entity : '${e}', entity name incorrect.`))
            }
        }
        req.body.path = sanitizePath(req.body.path);

        const permissions = getPermissionsFor(
            req.app.locals.config,
            req.body.path,
            res.locals.userSession ? res.locals.userSession['username'] : null
        );
        if (!permissions.upload || !permissions.autoindex){
            if (!res.locals.userSession){
                return next(new HttpError(401));
            }
            return next(new HttpError(403));
        }
        for (const e of req.body.entities){
            await fs.promises.rm(path.join(req.app.locals.config['dir'], req.body.path, e), {recursive: true})
        }
        res.status(200).json({"detail":"ok"});
    } catch (err){
        next(err);
    }
}

async function createFolderForm(req, res, next){
    try {
        if (typeof req.body?.path !== 'string'){
            return next(new HttpError(400, "path is a required field and must be string"));
        }
        if (typeof req.body?.name !== 'string'){
            return next(new HttpError(400, "name is a required field and must be string"));
        }
        if (req.body.name.includes('/') || req.body.name === '..' || req.body.name === '.'){
            return next(new HttpError(400, `Incorrect name, please change the name.`))
        }

        req.body.path = sanitizePath(req.body.path);

        const permissions = getPermissionsFor(
            req.app.locals.config,
            req.body.path,
            res.locals.userSession ? res.locals.userSession['username'] : null
        );
        if (!permissions.upload){
            if (!res.locals.userSession){
                return next(new HttpError(401));
            }
            return next(new HttpError(403));
        }
        await fs.promises.mkdir(
            path.join(req.app.locals.config['dir'], req.body.path, req.body.name),
            {mode:req.app.locals.config['folder_creation_mode']}
        )
        res.status(200).json({"detail":"ok"});
    } catch (err){
        if(err){
            if (err.code === 'EEXIST'){
                return next(new HttpError(400,"There is already a directory/file under this path, please change the name."))
            }
        }
        next(err);
    }
}

module.exports = {
    uploadForm,
    deleteForm,
    createFolderForm
}