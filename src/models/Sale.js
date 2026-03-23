const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Sale = sequelize.define('Sale', {
    sale_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    invoice_id: {
        type: DataTypes.STRING(25),
        allowNull: true
    },
    sale_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    sub_total: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    pay_method: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    create_by: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_on: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    changed_by: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    changed_on: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'tbl_sale'
});

module.exports = Sale;
