
const {HttpError} = require("../utils/errors");
const {sortArrayOfDict} = require("../utils/helpers")
const path = require('node:path')


module.exports = function(args){
    return async function paramsMiddleware(req, res, next) {
        for (const i in args){
            res.locals[i] = args[i]
        }
        next()
    }
}
