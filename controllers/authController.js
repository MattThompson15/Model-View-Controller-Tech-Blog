const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword });

        req.session.user = {
            id: newUser.id,
            username: newUser.username,
        };

        res.redirect('/');
    }   catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: {username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = {
                id: user.id,
                username: user.username,
            };

            res.redirect('/');
        }   else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    }   catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error('Error destroying session', err);
            res.status(500).json({ error: 'Internal server error'});
        } else {
          res.redirect('/');
        }
    });
});

module.exports = router;
