const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GeneralSetting = sequelize.define('GeneralSetting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Stock_alert: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Qty_alert: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    remark: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    is_alert: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'tbl_general_setting'
});

module.exports = GeneralSetting;
