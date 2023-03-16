const uuid = require('uuid')
const {HttpError} = require("../utils/errors");

async function login(req, res, next) {
    try {
        res.render('auth/login', { title: 'Login'})
    } catch (err) {
        next(err);
    }
}
async function loginForm(req, res, next){
    try {
        let {username, password, persistent} = req.body
        username = username.replace(" ","");
        const authenticPassword = req.app.locals.config['users'][username]?.password;

        if (!username) {
            return next(new HttpError(401, "username is a required field"));
        }
        if (authenticPassword !== password) {
            return next(new HttpError(401, "Incorrect password or username"));
        }
        const sessionToken = uuid.v4();

        let maxAge = undefined

        if (persistent){
            maxAge = 30 * 24 * 60 * 60;
        }
        await req.app.locals.store.set("sessions:" + sessionToken, {"username": username}, maxAge)

        res.cookie(req.app.locals.config['cookie_key'], sessionToken, { maxAge: maxAge });
        res.status(200).json({"detail":"Ok"});
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next){
    try{
        if (!req.cookies) {
            res.redirect("/");
            return;
        }

        const sessionToken = req.cookies[req.app.locals.config['cookie_key']];
        if (!sessionToken) {
            res.redirect("/");
            return;
        }
        await req.app.locals.store.delete("sessions:" + sessionToken);

        res.cookie(req.app.locals.config['cookie_key'], "", { maxAge: 0 })
        res.redirect("/")
    } catch (err) {
        next(err)
    }

}

module.exports = {
    login,
    loginForm,
    logout,
};