const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try {
        const token = req.header('x-auth-token');

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded.user;
            next();
        } catch (error) {
            return res.status(401).send("Invalid Token")
        }
    }
    catch (error)
    {
        res.send("Error");
    }
}

module.exports = auth;