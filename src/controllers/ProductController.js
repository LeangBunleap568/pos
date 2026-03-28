const products = require("../models/MasterProduct")
const { Op, fn, col } = require('sequelize');
const logError = require('../service/service');
const buildPhotoPath = (file) => {
    if (file) {
        return `${process.env.BASE_URL || 'http://localhost:5000'}/assets/upload/${file.filename}`;
    }
    return null;
};
const get = async (req, res) => {
    try {
        const { keyword } = req.query
        let whereCondition = {}
        if (keyword && keyword.trim() !== "") {
            whereCondition = {
                [Op.or]: [
                    { prd_id: { [Op.like]: `%${keyword}%` } },
                    { prd_name: { [Op.like]: `%${keyword}%` } },
                    { category_id: { [Op.like]: `%${keyword}%` } },
                    { brand_id: { [Op.like]: `%${keyword}%` } },
                    { prd_name: { [Op.like]: `%${keyword}%` } }
                ]
            }
        }
        const result = await products.findAll({
            where: whereCondition,
            order: [
                [fn('LENGTH', col('prd_id')), 'ASC'],
                ['prd_id', 'ASC']
            ]
        })
        if (result.length === 0) {
            return res.json({
                message: keyword ? `No results found for "${keyword}"` : "Database is empty",
                count: 0,
                result: []
            });
        }
        res.json({
            message: keyword ? "Search results" : "Get all data successfully",
            count: result.length,
            data: result
        })
    }
    catch (err) {
        logError("get product", err, res)
    }
}
const create = async (req, res) => {
    try {
        const { prd_id, prd_name, category_id, brand_id, stock_date, exp_date, qty, unit_cost, telegram, status, remark } = req.body
        const photoUrl = buildPhotoPath(req.file);
        
        const data = await products.findByPk(prd_id)
        if (data) {
            return res.status(400).json({
                message: "Product already exists",
                data: data
            })
        }
        
        const result = await products.create(
            {
                prd_id,
                prd_name,
                category_id: category_id || null,
                brand_id: brand_id || null,
                stock_date,
                exp_date,
                qty,
                unit_cost,
                telegram,
                status,
                remark,
                photo: photoUrl
            }
        )
        
        if (result) {
            res.json({
                message: "Create product successfully",
                data: result
            })
        }
        else {
            res.json({
                message: "Create product failed",
                data: null
            })
        }
    }
    catch (err) {
        logError("create product", err, res)
    }
}
const update = async (req, res) => {
    try {
        const { prd_id } = req.params
        const { prd_name, category_id, brand_id, stock_date, exp_date, qty, unit_cost, telegram, status, remark } = req.body
        const photoUrl = buildPhotoPath(req.file);
        
        const result = await products.findByPk(prd_id)
        if (!result) { return res.status(404).json({ message: "ID not Found" }) }

        if (prd_name !== undefined) result.prd_name = prd_name
        if (category_id !== undefined) result.category_id = category_id || null
        if (brand_id !== undefined) result.brand_id = brand_id || null
        if (stock_date !== undefined) result.stock_date = stock_date
        if (exp_date !== undefined) result.exp_date = exp_date
        if (qty !== undefined) result.qty = qty
        if (unit_cost !== undefined) result.unit_cost = unit_cost
        if (telegram !== undefined) result.telegram = telegram
        if (status !== undefined) result.status = status
        if (remark !== undefined) result.remark = remark
        if (photoUrl) result.photo = photoUrl

        await result.save()
        res.status(200).json({
            message: "Product updated Successfully",
            data: result
        })
    }
    catch (err) {
        logError("update product", err, res)
    }
}
const delete_ = async (req, res) => {
    try {
        const { prd_id } = req.params
        const result = await products.findByPk(prd_id)
        if (!result) { return res.status(404).json({ message: "Product Id not Found" }) }
        await result.destroy({
            where: {
                prd_id: prd_id
            }
        })
        res.status(200).json({ message: "Product deleted successfully", data: result })
    }
    catch (err) {
        logError("delete", err, res)
    }
}
module.exports = {
    get,
    create,
    update,
    delete_,
}