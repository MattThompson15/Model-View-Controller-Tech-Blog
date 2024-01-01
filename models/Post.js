const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: 'userId',
        });

        Post.hasMany(models.Comment, {
            foreignKey: 'postId',
            onDelete: 'CASCADE',
        });
    };

    return Post;

};