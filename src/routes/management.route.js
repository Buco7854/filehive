const express = require('express');
const router = express.Router();
const {uploadForm, deleteForm, createFolderForm} = require("../controllers/management.controller");
const params = require("../middlewares/params.middleware")

module.exports = function(app){
    router.post(
        app.locals.config['upload_path'],
        params({"isJson": true}),
        app.locals.multerUpload.array('files[]'),
        uploadForm
    )
    router.post(
        app.locals.config['delete_path'],
        params({"isJson": true}),
        app.locals.multerUpload.none(),
        deleteForm
    )
    router.post(
        app.locals.config['create_folder_path'],
        params({"isJson": true}),
        app.locals.multerUpload.none(),
        createFolderForm
    )
    return router
}