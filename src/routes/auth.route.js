const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {loginLimiter} = require("../middlewares/auth.middleware");
const params = require("../middlewares/params.middleware")

module.exports = function(app){
    router.get('/login', authController.login);
    router.get("/logout", authController.logout)
    router.post('/forms/login', params({"isJson": true}),loginLimiter(app), authController.loginForm)
    return router
};