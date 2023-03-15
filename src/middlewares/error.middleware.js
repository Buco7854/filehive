const {HttpError, httpStatus} = require('../utils/errors')
const {MulterError} = require("multer");
const {isHttpError} = require("http-errors");

function errorHandler (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    let status = 500;
    let message = null;
    let isJson = res.locals.isJson || false;

    // Since static as fallthrough to true, they return an HttpError from http-errors
    // We use its func to know if it is and sets to 404 the status.
    // I could have used this module for all HttpErrors but the error message was always passed by express also the default error message is just the error tile.
    if (isHttpError(err)) {
        status = 404;
    }
    else if (err.code === "EPERM" || err.code === "EACCES"){
        console.log(err.stack)
        status = 403
        message = "Sorry FileHive is missing permissions."
    }
    else if (err instanceof HttpError){
        status = err.status;
        message = err.message;
    }
    else if (err instanceof MulterError && err.code){
        status = 400;
        message = err.message;
    }
    else{
        console.log(err.stack);
    }
    if (isJson){
        res.status(status).json({"detail":message || httpStatus[status]?.message});
    }
    else{
        res.status(status).render('errors/error', {
            status : status,
            title: httpStatus[status]?.name || "",
            message: message || httpStatus[status]?.message || "",
            buttonMessage: status === 401 ? "Login" : "BACK TO HOME",
            buttonHref: status === 401 ? "/login" : "/",
            noHistory : status === 401,
        })
    }
}
module.exports = errorHandler