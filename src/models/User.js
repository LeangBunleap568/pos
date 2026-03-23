const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: true
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tbl_user'
});

module.exports = User;
