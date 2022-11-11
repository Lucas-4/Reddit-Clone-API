const Subreddit = require('../models/subreddit.js');
const express = require('express');
const auth = require('../middleware/auth.js');
const cookieParser = require('cookie-parser');
const Post = require('../models/posts.js');

const router = express.Router();

router.post('/subreddits', auth(), async (req, res) => {
    try {
        const subreddit = new Subreddit();
        req.body.owner_id = req.user.id;
        subreddit.create(req.body);
        await subreddit.save();
        res.send(subreddit);
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/subreddits', async (req, res) => {
    try {
        const subreddits = await Subreddit.getAll();
        res.send(subreddits)
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/subreddits/:id', async (req, res) => {
    try {
        const subreddit = await Subreddit.getById(req.params.id);
        res.send(subreddit);
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/subreddits/:id/posts', async (req, res) => {
    try {
        const posts = await Subreddit.getPosts(req.params.id);
        res.send(posts);
    } catch (e) {
        res.status(400).send();
    }
})

module.exports = router;