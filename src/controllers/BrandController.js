const { Op, fn, col } = require('sequelize');
const Brand = require('../models/Brand');
const logError = require('../service/service');
const Get = async (req, res) => {
    try {
        const { keyword } = req.query;
        let whereCondition = {};
        if (keyword && keyword.trim() !== "") {
            whereCondition = {
                [Op.or]: [
                    { code: { [Op.like]: `%${keyword}%` } },
                    { desc: { [Op.like]: `%${keyword}%` } },
                    { category_id: { [Op.like]: `%${keyword}%` } },
                    { remark: { [Op.like]: `%${keyword}%` } },
                    { photo: { [Op.like]: `%${keyword}%` } }
                ]
            };
        }

        const data = await Brand.findAll({
            where: whereCondition,
            order: [
                [fn('LENGTH', col('code')), 'ASC'],
                ['code', 'ASC']
            ]
        });
        res.json({
            message: keyword ? "Search results" : "Get all data successfully",
            count: data.length,
            data: data
        });

    } catch (err) {
        logError("get_brand", err, res);
    }
}
const buildPhotoPath = (req, file) => {
    if (file) {
        return `${process.env.BASE_URL || 'http://localhost:5000'}/assets/upload/${file.filename}`;
    }
    return null;
};
const Create = async (req, res) => {
    try {
        const { code, desc, category_id, remark } = req.body
        const photoUrl = buildPhotoPath(req, req.file);
        const data = await Brand.findByPk(code)
        if (data) {
            return res.status(400).json({ message: "Brand code already exists" })
        }
        const brandCreated = await Brand.create({
            code,
            desc,
            category_id,
            remark,
            photo: photoUrl
        })
        res.json({
            message: "Brand created successfully",
            data: brandCreated
        })
    }
    catch (err) {
        logError("create_brand", err, res)
    }
}
const Update = async (req, res) => {
    try {
        const { code } = req.params
        const { desc, category_id, remark } = req.body
        const photoUrl = buildPhotoPath(req, req.file);
        const data = await Brand.findByPk(code)
        if (!data) {
            return res.status(404).json({ message: "Brand not Found" })
        }
        data.desc = desc !== undefined ? desc : data.desc
        data.category_id = category_id !== undefined ? category_id : data.category_id
        data.remark = remark !== undefined ? remark : data.remark

        if (photoUrl) {
            data.photo = photoUrl;
        }

        await data.save()
        res.status(200).json({
            message: "Brand update successfully",
            data: data
        })
    }
    catch (err) {
        logError("update_brand", err, res)
    }
}
const Delete = async (req, res) => {
    try {
        const { code } = req.params
        const data = await Brand.findByPk(code)
        if (!data) {
            return res.status(404).json({ message: "Brand not Found" })
        }
        await Brand.destroy({
            where: {
                code: code
            }
        })
        res.status(200).json({
            message: "Brand deleted successfully",
            data: data
        })
    }
    catch (err) {
        logError("Delete", err, res)
    }
}
module.exports = {
    Get,
    Create,
    Update,
    Delete,
}