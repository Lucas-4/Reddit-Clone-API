const express = require('express');
const User = require('../models/user.js')
const auth = require('../middleware/auth.js');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());

//route to handle user signup
//request body example:
// {
//     "name": "usernamename",
//     "email": "usermail@mail.com",
//     "password": "userpassword123"
// }
router.post('/users', async (req, res) => {

    const validation = {};

    try {
        let userExists = await User.getByName(req.body.name);

        if (req.body.name.trim().length === 0 || req.body.name.length < 3) {
            validation.username = 'Username must have a minimum of 3 characters';
        } else if (userExists !== undefined) {
            validation.username = 'Username already in use';
        } else {
            validation.username = 'valid';
        }



        userExists = await User.getByEmail(req.body.email);
        if (userExists === undefined) {
            validation.email = 'valid';

        } else {
            validation.email = 'Email already in use';

        }

        if (req.body.password.length < 8 || req.body.password.trim().length === 0) {
            validation.password = 'Password must contain 8 characters or more';
        } else {
            validation.password = 'valid';

        }
        if (validation.username != 'valid' || validation.email != 'valid' || validation.password != 'valid') {
            throw Error();
        }

        const user = new User();
        user.create(req.body);
        console.log(req.body);
        await user.save();
        const token = user.generateAuthToken();
        delete user.password;
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000000,
            secure: true
        })
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(validation);
    }
})



router.post('/users/login', async (req, res) => {
    const user = new User();
    try {
        await user.login(req.body);
        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000000,
            secure: true
        })
        res.send();
    } catch (e) {
        res.status(401).send();
    }
})

router.post('/users/logout', (req, res) => {
    res.clearCookie('token', {
        sameSite: 'none',
        secure: true
    });
    res.send();
})

router.get('/users/me', auth(true), (req, res) => {
    try {
        if (req.user === undefined) {
            req.user = { name: null };
        }
        res.send(req.user);
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/users/me/posts', auth(), async (req, res) => {
    try {
        const posts = await User.getPosts(req.user.id);
        res.send(posts);
    } catch (e) {
        res.status(400).send();
    }
})

router.delete('/users/me', auth(), (req, res) => {
    try {
        User.deleteById(req.user.id);
    } catch (e) {
        res.status(400).send();
    }
})
module.exports = router;