const jwt = require("jsonwebtoken");

function auth(req, res, next){
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).send({errors: {msg: "no token. Authentication failed"}});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch(err) {
        return res.status(401).send({errors: {msg: "Token is not valid"}});
    }
}

module.exports = auth;