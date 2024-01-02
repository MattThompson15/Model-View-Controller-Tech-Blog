const express = require('express');
const { Post, User, Comment } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, attributes: ['username'] }],
        });
        res.render('all-posts', { posts });
    }   catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] },
            ],
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.render('single-post', { post });
    }   catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/create', (req, res) => {
    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }
    res.render('create-post');
});

router.post('/create', async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.session.user.id;

        const post = await Post.create({ title, content, userId });
        res.redirect(`/posts/post/${post.id}`);
    } catch (error) {
        console.error('Error creating a new post:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.render('edit-post', { post });
    }   catch(error) {
        console.error('Error fetching post details for editing', error);
        res.status(500).json({ error: 'Internal server error'});
    };
})

router.post('/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        await Post.update({ title, content }, { where: { id: postId} });
        res.redirect(`/posts/post/${postId}`);
    }   catch (error) {
        console.error('Error updating the post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        await Post.destroy({ where: { id: postId } });
        res.redirect('/posts');
    }   catch (error) {
        console.error('Error deleting the post', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

module.exports = router;

