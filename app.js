const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();

const UserModel = require('./models/User');
const PostModel = require('./models/Post');
const CommentModel = require('./models/Comment');


const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',
    },
});

const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);

sequelize.sync({ force: false}).then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Error syncing database:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
