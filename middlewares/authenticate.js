const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next(HttpError(401));
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);//для перевірки токена
        const user = await User.findById(id);//чи є людина в базі
        if (!user || !user.token || user.token !== token) {
        //if(!user){
            next(HttpError(401));
        }
        req.user = user;
        next();
    }
    catch {
        next(HttpError(401));
    }
}
module.exports = authenticate;