const express = require('express');
const { Post, User, Comment } = require('../models');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            include: [
                {model: User, attributes: ['username'] },
                {model: Comment, include: [{ model: User, attributes: ['username'] }] },
            ],
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.render('post', { post });
    }   catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/add', (req, res) => {
    res.render('add-post');
  });

  router.post('/create', async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.session.user.id;

        const newPost = await Post.create({ title, content, userId });
        
        res.redirect(`/posts/${newPost.id}`)
    }   catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
  });

  router.get('/:id/edit', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (req.session.user.id !== post.userId) {
            res.status(403).json({ error: 'Permission denied' });
            return;
        }

        res.renders('edit-post', { post });
    }   catch (error) {
        console.error('Error fetching post for editing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/edit', async (req, res) => {
    try {
        const postId = req.params.id;
        const {title, content } = req.body;
        const post = await Post.findByPk(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (req.session.user.id !== post.userId) {
            res.status(403).json({ error: 'Permission denied' });
            return;
        }

        post.title = title;
        post.content = content;
        await post.save();

        res.redirect(`/posts/${postId}`);
    }   catch (error) {
        console.error('Error editing post:'. error);
        res.status(500).json({ error: 'Internal server error'});
    }
  });

  router.post('/:id/delete', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        if (req.session.user.id !== post.userId) {
            res.status(403).json({ error: 'Permission denied' });
            return;
        }

        await post.destroy();
        res.redirect('/');
    }   catch (error) {
        console.error('Error deleting post', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;