const sequelize = require('../config/sequelize');
const Brand = require('./Brand');
const Category = require('./Category');
const Customer = require('./Customer');
const GeneralSetting = require('./GeneralSetting');
const MasterProduct = require('./MasterProduct');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const PaymentMethod = require('./PaymentMethod');
const Sale = require('./Sale');
const SaleItemDetail = require('./SaleItemDetail');
const Setting = require('./Setting');
const StoreInfo = require('./StoreInfo');
const Telegram = require('./Telegram');
const User = require('./User');


// Associations
Category.hasMany(Brand, { foreignKey: 'category_id' });
Brand.belongsTo(Category, { foreignKey: 'category_id' });

Brand.hasMany(MasterProduct, { foreignKey: 'brand_id' });
MasterProduct.belongsTo(Brand, { foreignKey: 'brand_id' });

Telegram.hasMany(MasterProduct, { foreignKey: 'telegram' });
MasterProduct.belongsTo(Telegram, { foreignKey: 'telegram' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Sale.hasMany(SaleItemDetail, { foreignKey: 'sale_id' });
SaleItemDetail.belongsTo(Sale, { foreignKey: 'sale_id' });

PaymentMethod.hasMany(Sale, { foreignKey: 'pay_method' });
Sale.belongsTo(PaymentMethod, { foreignKey: 'pay_method' });

Order.hasOne(Customer, { foreignKey: 'customer_id' });
Customer.belongsTo(Order, { foreignKey: 'customer_id' });

module.exports = {
    sequelize,
    Brand,
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
    User,
};
