const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Brand = sequelize.define('Brand', {
    code: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    category_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: 'tbl_category',
            key: 'code'
        }
    },
    remark: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'tbl_brand'
});

module.exports = Brand;
