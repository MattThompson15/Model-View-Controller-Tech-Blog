require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const userController = require('./controllers/userController');
const app = express();

const UserModel = require('./models/User');
const PostModel = require('./models/Post');
const CommentModel = require('./models/Comment');


app.use(
    session({
        secret: 'YGVbJ@/[QS@[9l|',
        resave: false,
        saveUninitialized: false,
    })
);

const sequelize = new Sequelize(process.env.tech_blog_db, process.env.root, process.env.Mgt95543, {
    host: process.env.localhost,
    dialect: 'mysql',
});

async function testDbConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully');
    }   catch (error) {
        console.error('Unable to cennect to the database:', error);
    }
}

testDbConnection();

const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);

User.associate({ Post, Comment });
Post.associate({ User, Comment });
Comment.associate({ User, Post });

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/auth', authController);

app.use('/posts', postController);

app.use('/users', userController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
});