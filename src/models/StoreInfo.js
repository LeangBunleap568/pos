const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StoreInfo = sequelize.define('StoreInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    store_name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'tbl_store_infor'
});

module.exports = StoreInfo;
