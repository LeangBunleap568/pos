const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
    code: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    remark: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
        validate: { isIn: [[0, 1]] }
    }
}, {
    tableName: 'tbl_category',
    timestamps: false 
});

module.exports = Category;