const { Op } = require('sequelize');
const { Category } = require('../models');
const logError = require('../service/service');

const Get = async (req, res) => {
    try {
        const { status, keyword } = req.query;
        let where = {};
        if (status !== undefined && status !== "") {
            where.status = status;
        }

        if (keyword && keyword.trim() !== "") {
            where[Op.or] = [
                { code: { [Op.like]: `%${keyword}%` } },
                { desc: { [Op.like]: `%${keyword}%` } }
            ];
        }

        const data = await Category.findAll({
            where: where
        });

        res.json({
            data: data
        });
    }
    catch (err) {
        logError('CategoryController_Get', err, res);
    }
}
const Create = async (req, res) => {
    try {
        const { code, desc, remark, status } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Category code is required" });
        }

        const existing = await Category.findByPk(code);
        if (existing) {
            return res.status(400).json({ message: "Category code already exists" });
        }
        const data = await Category.create({
            code,
            desc,
            remark,
            status: status !== undefined ? status : 1
        });
        res.status(201).json({ message: 'Category created successfully', data: data });
    }
    catch (err) {
        logError('CategoryController_create', err, res);
    }
}
const Delete = async (req, res) => {
    try {
        const { code } = req.params
        const data = await Category.findByPk(code)
        if (!data) {
            return res.status(404).json({ message: "Data not found" })
        }
        await Category.destroy({
            where: { code: code }
        });
        res.json({
            message: "Deleted successfully",
            data: data
        })
    }
    catch (err) {
        logError("CategoryController_delete", err, res)
    }
}
const Update = async (req, res) => {
    try {
        const { code } = req.params
        const { desc, remark, status } = req.body
        const data = await Category.findByPk(code);
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        // 2. Update the fields 
        data.desc = desc !== undefined ? desc : data.desc;
        data.remark = remark !== undefined ? remark : data.remark;
        data.status = status !== undefined ? status : data.status;
        // 3. Save to Database
        await data.save()
        // 4. Return the updated object in an array
        res.json({
            message: "update successfully",
            data: data
        })
    }
    catch (err) {
        logError("CategoryController_update", err, res)
    }
}
const Search = async (req, res) => {
    try {
        const { keyword } = req.query;

        // 1. Validation check
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        // 2. Database Query
        const data = await Category.findAll({
            where: {
                [Op.or]: [
                    { code: { [Op.like]: `%${keyword}%` } },
                    { desc: { [Op.like]: `%${keyword}%` } }
                ]
            }
        });

        // 3. Response
        res.json({
            success: true,
            data: data, // This will be your [] array
            count: data.length
        });
    }
    catch (err) {
        logError("Search", err, res);
    }
};
const Count = async (req, res) => {
    try {
        const total = await Category.count();
        const active = await Category.count({ where: { status: 1 } });
        const inactive = await Category.count({ where: { status: 0 } });
        res.json({
            total,
            active,
            inactive
        });
    }
    catch (err) {
        logError("CategoryController_count", err, res);
    }
}
module.exports = {
    Get,
    Create,
    Delete,
    Update,
    Search,
    Count
}