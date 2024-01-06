const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({
            username,
            email,
            password,
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1) Check if email and password exist
        if (!email || !password) {
            throw new Error('Please provide email and password!');
        }
        // 2) Check if user exists && password is correct
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Incorrect email or password');
        }
        // 3) If everything ok, send token to client
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}