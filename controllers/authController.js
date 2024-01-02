const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid credentials'});
            return;
        }

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: 'Login successful.'});
    }   catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

router.post('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.json({ message: 'Logout successful.'});
    }   catch (error) {
        xonosle.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

module.exports = router;
