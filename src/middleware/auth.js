const jwt = require('jsonwebtoken');
const User = require('../models/user.js')
const cookieParser = require('cookie-parser');

module.exports = (optional) => {
    return async (req, res, next) => {
        if (optional == undefined) {
            optional = false;
        }

        try {

            const token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.getById(decoded.id);
            if (user == undefined) {
                throw new Error();
            }
            req.user = user;
            next();

        } catch (e) {
            if (!optional) {
                res.status(401).send({ error: 'please authenticate' });
            } else {
                next();
            }
        }

    }
}