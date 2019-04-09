const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        res.status(401).send("Access Denied : UnAthorised User")
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        console.log("Decoded Value: " + req.user);
        next();

    } catch (e) {
        res.status(400).send("Invalid Token");
    }
}