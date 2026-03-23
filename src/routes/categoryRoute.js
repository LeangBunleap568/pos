const { Get, Create, Delete, Update, Search, Count } = require("../controllers/CategoryController");

const Category = (app) => {
    app.get('/api/category', Get);
    app.get('/api/category/count', Count);
    app.post('/api/category', Create);
    app.delete('/api/category/:code', Delete);
    app.put('/api/category/:code', Update)
    app.get('/api/category/search', Search);
}
module.exports = Category;