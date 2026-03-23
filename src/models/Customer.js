const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Customer = sequelize.define('Customer', {
    customer_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    gmail: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_by: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    changed_by: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    changed_on: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'tbl_customer'
});

module.exports = Customer;
