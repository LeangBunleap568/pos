const { Get, create, getOne, login, update, delete_user, sendOTP, verifyOTP, resetPassword } = require("../controllers/UserController")
const authMiddleware = require("../auth/middleware")

userRoute = (app) => {
    app.post('/api/user/login', login)
    app.post('/api/user/create', authMiddleware.validate_token(), create)
    app.get('/api/user/get', authMiddleware.validate_token(), Get)
    app.put('/api/user/update/:user_id', authMiddleware.validate_token(), update)
    app.get('/api/user/get/:id', authMiddleware.validate_token(), getOne)
    app.delete('/api/user/delete/:user_id', authMiddleware.validate_token(), delete_user)
    app.post('/api/user/sendOTP', sendOTP)
    app.post('/api/user/verifyOTP', verifyOTP)
    app.post('/api/user/resetPassword', resetPassword)
}
module.exports = userRoute 
