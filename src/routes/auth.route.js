const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {loginLimiter} = require("../middlewares/auth.middleware");
const params = require("../middlewares/params.middleware")

module.exports = function(app){
    router.get(app.locals.config["login_path"], authController.login);
    router.get(app.locals.config["logout_path"], authController.logout)
    router.post(app.locals.config["login_form_path"], params({"isJson": true}),loginLimiter(app), authController.loginForm)
    return router
};