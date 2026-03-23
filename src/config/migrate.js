const sequelize = require('./sequelize');
const { Brand,
    Category,
    Customer,
    GeneralSetting,
    MasterProduct,
    Order,
    OrderItem,
    PaymentMethod,
    Sale,
    SaleItemDetail,
    Setting,
    StoreInfo,
    Telegram,
    User, } = require('../models');
const migrate = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

module.exports = migrate;


