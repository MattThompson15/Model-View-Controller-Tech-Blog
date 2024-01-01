const { DataTypes } = require('sequelize');

module.exports = (sequalize) => {
    const User = sequalize.define('User', {
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

    user.associate = (models) => {
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