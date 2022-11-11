const db = require('../db/db.js');

module.exports = class Post {
    create({ id, title, content, post_owner_id, subreddit_id }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.post_owner_id = post_owner_id;
        this.subreddit_id = subreddit_id;
    }

    async save() {
        await db.execute('INSERT INTO post (title, content, post_owner_id, subreddit_id) VALUES (?, ?, ?, ?)', [this.title, this.content, this.post_owner_id, this.subreddit_id]);
    }

    static async getById(id) {

        console.log(await db)
        const result = await db.execute('SELECT post.id, post.title, post.content, post.created_date, user.name as username, user.id as user_id, subreddit.name as subreddit_name, subreddit.id as subreddit_id,  CAST(coalesce(sum(vote.vote_value), 0) as signed) as vote_count FROM post inner join subreddit on post.subreddit_id = subreddit.id and post.id=? inner join user on post_owner_id=user.id left join vote on post.id=vote.post_id group by post.id', [id]);
        return result[0][0];
    }

    static async getByIdAuthenticated(id, user_id) {
        const result = await db.execute('select posts.*, vote.vote_value from (select post.id, post.title, post.content, post.post_owner_id, user.name as username, post.subreddit_id, subreddit.name as subreddit_name, CAST(coalesce(sum(vote.vote_value), 0) as signed) as vote_count from post left join vote on post.id = vote.post_id inner join subreddit on subreddit.id=post.subreddit_id inner join user on user.id = post.post_owner_id where post.id=? and post.post_owner_id = ? group by post.id) as posts left join vote on posts.post_owner_id=vote.user_id and posts.id=vote.post_id', [id, user_id]);
        return result[0];
    }

    static async getPosts(orderBy) {
        if (orderBy === 'random') {
            orderBy = 'rand()';
        }
        if (orderBy === 'new') {
            orderBy = 'created_date desc';
        }
        if (orderBy === 'top') {
            orderBy = 'vote_count desc';
        }
        const result = await db.execute(`SELECT post.id, post.title, post.content, post.created_date, user.name as username, user.id as user_id, subreddit.name as subreddit_name, subreddit.id as subreddit_id,  CAST(coalesce(sum(vote.vote_value), 0) as signed) as vote_count FROM post inner join subreddit on post.subreddit_id = subreddit.id inner join user on post_owner_id=user.id left join vote on post.id=vote.post_id group by post.id order by ${orderBy}`);
        return result[0];
    }

    static async getPostsAuthenticated(user_id, orderBy) {
        if (orderBy === 'random') {
            orderBy = 'rand()';
        }
        if (orderBy === 'new') {
            orderBy = 'created_date desc';
        }
        if (orderBy === 'top') {
            orderBy = 'vote_count desc';
        }
        const result = await db.execute(`select posts_with_votes.id, title, content, created_date, username, posts_with_votes.user_id, subreddit_name, subreddit_id, vote_count, vote_value from (SELECT post.id, post.title, post.content, post.created_date, user.name as username, user.id as user_id, subreddit.name as subreddit_name, subreddit.id as subreddit_id,  CAST(coalesce(sum(vote.vote_value), 0) as signed) as vote_count FROM post inner join subreddit on post.subreddit_id = subreddit.id inner join user on post_owner_id=user.id left join vote on post.id=vote.post_id group by post.id) as posts_with_votes left join vote on posts_with_votes.id=vote.post_id and vote.user_id=? order by ${orderBy}`, [user_id]);
        return result[0];
    }

    static async update(title, content, post_id, user_id) {
        const res = await db.execute('UPDATE post SET title = ?, content = ? WHERE id = ? AND post_owner_id = ?', [title, content, post_id, user_id]);
        return res;
    }

    static async deleteById(id, user_id) {
        await db.execute('DELETE FROM post WHERE id = ? AND post_owner_id = ?', [id, user_id]);
    }
}