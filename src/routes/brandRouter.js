const { Get, Create, Update, Delete } = require("../controllers/BrandController")
const { uploadPhoto } = require('../middleware/upload');

const Brand = (app) => {
     app.get("/api/brand/get", Get)
     app.post("/api/brand/create", uploadPhoto, Create)
     app.put("/api/brand/update/:code", uploadPhoto, Update)
     app.delete("/api/brand/delete/:code", Delete)
}
module.exports = Brand
