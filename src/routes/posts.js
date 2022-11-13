const express = require('express');
const Post = require('../models/posts.js');
const auth = require('../middleware/auth.js');


const router = express.Router();

router.post('/posts', auth(), async (req, res) => {
    const validation = {};

    try {
        if (req.body.title.trim().length === 0) {
            validation.title = 'Title must not be empty';
        } else {
            validation.title = 'valid'
        }

        if (req.body.content.trim().length === 0) {
            validation.content = 'Content must not be empty';
        } else {
            validation.content = 'valid';
        }

        if (validation.title !== 'valid' || validation.content !== 'valid') {
            throw Error();
        }

        const post = new Post();
        req.body.post_owner_id = req.user.id;
        console.log(req.body);
        post.create(req.body);
        await post.save();
        res.send(post);
    } catch (e) {
        res.status(400).send(validation);
    }
})

router.get('/posts', auth(true), async (req, res) => {
    let orderBy = req.query.orderBy;
    const allowedQueries = ['random', 'new', 'top'];
    if (!allowedQueries.includes(orderBy)) {
        orderBy = 'random';
    }
    try {
        if (req.user === undefined) {
            const posts = await Post.getPosts(orderBy);
            res.send(posts);
        } else {
            const posts = await Post.getPostsAuthenticated(req.user.id, orderBy);
            res.send(posts);
        }
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
})

router.get('/posts/:id', auth(true), async (req, res) => {
    let post;
    try {
        if (req.user === undefined) {
            post = await Post.getById(req.params.id);
            res.send([post]);
        } else {
            post = await Post.getByIdAuthenticated(req.params.id, req.user.id);
            res.send(post);
        }


    } catch (e) {
        res.status(400).send();
    }

})

router.put('/posts/:id', auth(), async (req, res) => {
    try {
        await Post.update(req.body.title, req.body.content, req.params.id, req.user.id);
        res.send();
    } catch (e) {
        res.status(400).send();
    }
})

router.delete('/posts/:id', auth(), async (req, res) => {
    try {
        await Post.deleteById(req.params.id, req.user.id);
        res.send();
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
})

module.exports = router;