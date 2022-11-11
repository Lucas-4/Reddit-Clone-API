const db = require('../db/db.js');

module.exports = class Subreddit {
    create({ name, description, owner_id }) {
        this.name = name;
        this.description = description;
        this.owner_id = owner_id;
    }

    async save() {
        await db.execute('INSERT INTO subreddit (name, description, owner_id) VALUES (?, ?, ?)', [this.name, this.description, this.owner_id]);
    }

    static async getById(id) {
        const result = await db.execute('SELECT * FROM subreddit WHERE id = ?', [id]);
        console.log(result[0]);
    }

    static async getAll() {
        const result = await db.execute('SELECT * FROM subreddit');
        return result[0];
    }

    static async getPosts(subreddit_id) {
        const result = await db.execute('SELECT * FROM post WHERE subreddit_id = ?', [subreddit_id]);
        console.log(result[0]);
    }

}