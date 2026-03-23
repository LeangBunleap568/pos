const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PaymentMethod = sequelize.define('PaymentMethod', {
    code: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    is_active: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'tbl_payment_method'
});

module.exports = PaymentMethod;
