const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MasterProduct = sequelize.define('MasterProduct', {
    prd_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    prd_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    category_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    brand_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    stock_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    exp_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unit_cost: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    telegram: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('low', 'avaible', 'unvaible'),
        allowNull: true
    },
    remark: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'tbl_master_product'
});

module.exports = MasterProduct;
