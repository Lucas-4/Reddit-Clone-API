const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();
const Vote = require('../models/votes.js');

router.post('/votes', auth(), async (req, res) => {

    const vote = new Vote();
    try {
        req.body.user_id = req.user.id;
        console.log(req.body)
        vote.create(req.body);
        await vote.save();
        return res.status(200).send({ success: 'success1' })
    } catch (e) {
        if (e.code == 'ER_DUP_ENTRY') {
            try {
                await vote.update();
                return res.status(200).send({ success: 'success2' })
            }
            catch (e) {
                return res.status(400).send({ error: 'error1' });
            }
        }
        res.status(400).send({ error: 'error2' });
    }
})

router.delete('/votes/:post_id', auth(), async (req, res) => {
    try {
        const vote = new Vote();
        req.params.user_id = req.user.id;

        vote.create(req.params);
        await vote.delete();
        res.status(200).send({ success: 'success' });
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;
