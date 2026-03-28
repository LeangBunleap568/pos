const { get, create, update, delete_ } = require("../controllers/ProductController")
const { uploadPhoto } = require('../middleware/upload');

const Product = (app) => {
    app.get("/api/product/get", get)
    app.post("/api/product/create", uploadPhoto, create)
    app.put("/api/product/update/:prd_id", uploadPhoto, update)
    app.delete("/api/product/delete/:prd_id", delete_)
}
module.exports = Product

