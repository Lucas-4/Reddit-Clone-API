const db = require('../db/db.js');
module.exports = class Vote {
    create({ vote_value, user_id, post_id }) {
        this.vote_value = vote_value;
        this.user_id = user_id;
        this.post_id = post_id;
    }

    async save() {
        const res = await db.execute('INSERT INTO vote (vote_value, user_id, post_id) VALUES(?, ?, ?)',
            [this.vote_value, this.user_id, this.post_id]);

        return res;
    }

    async update() {
        const res = await db.execute('UPDATE vote SET vote_value = ? WHERE user_id = ? AND post_id = ?',
            [this.vote_value, this.user_id, this.post_id]);
        return res;
    }

    async getVotes() {
        const upvotes = await db.execute('SELECT COUNT(*) FROM vote WHERE vote_value = ? AND post_id = ?',
            [this.vote_value, this.post_id]);
        console.log(upvotes);
    }

    async delete() {
        const res = await db.execute('DELETE FROM vote WHERE user_id = ? AND post_id = ?', [this.user_id, this.post_id]);
        return res;
    }
}