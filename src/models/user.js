const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class User {
    create({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async save() {
        this.password = await bcrypt.hash(this.password, 8);
        const result = await db.execute('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [this.name, this.email, this.password]);
        this.id = result[0].insertId;
    }

    async login({ email, password }) {
        const result = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        const user = result[0][0];

        if (user == undefined) {
            throw new Error('Unable to login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Unable to login');
        }

        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
    }

    static async deleteById(id) {
        await db.execute('DELETE FROM user WHERE id = ?', [id]);
    }

    static async getById(id) {
        const result = await db.execute('SELECT * FROM user WHERE id = ?', [id]);
        const user = result[0][0];
        delete user.password;

        return user;
    }

    static async getByName(username) {
        const result = await db.execute('select * from user where user.name = ?', [username]);
        return result[0][0];
    }

    static async getByEmail(email) {
        const result = await db.execute('select * from user where user.email = ?', [email]);
        return result[0][0];
    }

    generateAuthToken() {
        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET);
        return token;
    }

    static async getPosts(user_id) {
        const res = await db.execute('select posts.*, vote.vote_value from (select post.id, post.title, post.content, post.post_owner_id, user.name as username, post.subreddit_id, subreddit.name as subreddit_name, CAST(coalesce(sum(vote.vote_value), 0) as signed) as vote_count from post left join vote on post.id = vote.post_id inner join subreddit on subreddit.id=post.subreddit_id inner join user on user.id = post.post_owner_id where post.post_owner_id = ? group by post.id) as posts left join vote on posts.post_owner_id=vote.user_id and posts.id=vote.post_id', [user_id]);
        return res[0];
        console.log(res);
    }
}
