const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Post, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        User.hasMany(models.Comment, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };

    return User;
};