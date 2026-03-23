const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    prd_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    unit_price: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    qty: {
        type: DataTypes.DOUBLE,
        allowNull: true
    }
}, {
    tableName: 'tbl_order_item'
});

module.exports = OrderItem;
