const user = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const logError = require("../service/service")
const { isValid } = require("../service/prevent")
const nodeMailer = require("nodemailer")
// store otp in memory
const otpStore = new Map()
const Get = async (req, res) => {
    try {
        const result = await user.findAll()
        res.status(200).json({
            message: "Get user successfully",
            data: result
        })
    }
    catch (err) {
        logError("Get user", err, res)
    }
}
const getOne = async (req, res) => {
    try {
        const { id } = req.params
        if (id == undefined || id == "" || id == null) {
            return res.status(400).json({
                message: "ID is required",
                data: null
            })
        }
        const ressult = await user.findByPk(id)
        if (!ressult) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        res.status(200).json({
            message: "Get user successfully",
            data: ressult
        })
    }
    catch (err) {
        logError("Get user", err, res)
    }
}
const create = async (req, res) => {
    try {
        // step 1: if email not input
        const { username, email, password, status } = req.body
        if (email == undefined || email == "" || email == null) {
            return res.status(400).json({
                message: "Email is required",
                data: null
            })
        }
        else {
            // step 2: if email have already
            const existUser = await user.findOne({ where: { email: email } })
            if (existUser) {
                return res.status(400).json({
                    message: "Email already exists",
                    data: null
                })
            }
        }
        // step 3: hash password
        const hashPassword = await bcrypt.hash(password, 10)
        // step 4: create user and put hash password
        const newUser = await user.create({
            username,
            email,
            password: hashPassword,
            status
        })
        res.status(200).json({
            status: true,
            message: "Create user successfully",
            data: newUser
        })
    }
    catch (err) {
        logError("Create user", err, res)
    }
}
const login = async (req, res) => {
    try {
        // step 1: if email or password not input
        const { email, password } = req.body
        if (isValid(email) || isValid(password)) {
            return res.status(400).json({
                message: "Email and password are required",
                data: null
            })
        }
        // step 2: if email not have in db return 404
        const userInfor = await user.findOne({ where: { email: email } })
        if (!userInfor) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        // step 3: if password not match return 401
        const validPassword = await bcrypt.compare(password, userInfor.password)
        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password",
                data: null
            })
        }
        // step 4: create token
        const token = jwt.sign({ email: userInfor.email }, process.env.JWT_SECRET, { expiresIn: "8h" })

        res.status(200).json({
            status: true,
            username: userInfor.username,
            message: "Login successfully",
            token: token
        })
    }
    catch (err) {
        logError("Login", err, res)
    }
}
const update = async (req, res) => {
    try {
        const { user_id } = req.params
        const { username, email, password, status } = req.body
        if (isValid(user_id)) {
            return res.status(400).json({
                message: "User ID is required",
                data: null
            })
        }
        const userInfor = await user.findByPk(user_id)
        if (!userInfor) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        userInfor.username = username !== undefined ? username : userInfor.username
        userInfor.email = email !== undefined ? email : userInfor.email
        if (password !== undefined) {
            userInfor.password = await bcrypt.hash(password, 10)
        }
        userInfor.status = status !== undefined ? status : userInfor.status
        await userInfor.save()
        res.status(200).json({
            status: true,
            message: "Update user successfully",
            data: userInfor
        })

    }
    catch (err) {
        logError("update error", err, res)
    }
}
const delete_user = async (req, res) => {
    try {
        const { user_id } = req.params
        if (isValid(user_id)) {
            return res.status(400).json({
                message: "User ID is required",
                data: null
            })
        }
        const result = await user.findByPk(user_id)
        if (!result) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        await result.destroy({ where: { user_id: user_id } })
        res.status(200).json({
            message: "User Delete Successfully!",
            data: result
        })
    }
    catch (err) {
        logError("delete_user", err, res)
    }
}
const sendOTP = async (req, res) => {
    try {
        //  step 1: if dont have email return 400
        const { email } = req.body
        if (isValid(email)) {
            return res.status(400).json({
                message: "Email is required",
                data: null
            })
        }
        //  step 2: if email have already in db return 400
        const userInfor = await user.findOne({ where: { email: email } })
        if (!userInfor) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        //  step 3: generate 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        //  step 4: set otp expiry time to 5 minutes
        const otp_expiry = new Date(Date.now() + 5 * 60 * 1000) // Valid for 5 minutes
        //  step 5: create transporter to send email
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        //  step 6: set db to compare when user verify otp
        userInfor.otp = otp
        userInfor.otp_expiry = otp_expiry
        //  step 7: save db
        await userInfor.save()
        //  step 8: send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userInfor.email,
            subject: "🔐 Your Verification Code",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; border: 1px solid #e1e4e8; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1a1a1a; margin: 0; font-size: 24px;">Verification Code</h2>
                    </div>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Hello,</p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Use the following 6-digit code to complete your verification process. This code will expire in <strong style="color: #d73a49;">5 minutes</strong>.</p>
                    <div style="margin: 35px 0; background-color: #f6f8fa; padding: 25px; text-align: center; border-radius: 12px; border: 1px dashed #d1d5da;">
                        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0366d6;">${otp}</span>
                    </div>
                    <p style="color: #6a737d; font-size: 14px; text-align: center;">If you did not request this code, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 30px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">&copy; 2026 InsideBox. All rights reserved.</p>
                </div>
            `
        }
        //  step 9: send email
        await transporter.sendMail(mailOptions)
        //  step 10: set otp in memory
        otpStore.set(email, {
            otp: otp,
            otp_expiry: otp_expiry,
            verified: false,
            verified_at: null
        })
        //  step 11: return response
        res.status(200).json({
            status: true,
            message: "OTP sent successfully. Please check your email.",
        })
    }
    catch (err) {
        logError("Send OTP error", err, res)
    }
}
const verifyOTP = async (req, res) => {
    try {
        // step 1: if dont have email or otp return 400
        const { email, otp } = req.body
        if (isValid(email) || isValid(otp)) {
            return res.status(400).json({
                message: "Email and OTP are required",
                data: null
            })
        }
        // step 2: get otp from memory
        let otpData = otpStore.get(email)
        let isVerified = false
        if (otpData) {
            // step 3: OTP found but expired
            if (Date.now() > otpData.otp_expiry) {
                otpStore.delete(email)
                return res.status(400).json({
                    message: "OTP has expired",
                    data: null
                })
            }
            // step 4: OTP matches correctly
            if (otpData.otp.toString() === otp.toString()) {
                isVerified = true
                // step 5: update in memory (otpstore)
                otpStore.set(email, {
                    ...otpData,
                    verified: true,
                    verified_at: new Date()
                })
            }
        }
        // step 6: if not verified in memory
        if (!isVerified) {
            const userRecord = await user.findOne({ where: { email: email } })
            // step 7: if user not found in db
            if (!userRecord) {
                return res.status(404).json({
                    message: "User not found",
                    data: null
                })
            }

            // step 8: Compare DB OTP with user input
            if (userRecord.otp === otp.toString()) {
                // step 9: check expiry
                if (new Date() > new Date(userRecord.otp_expiry)) {
                    return res.status(400).json({
                        message: "OTP has expired",
                        data: null
                    })
                }
                isVerified = true
                // step 10: update in memory (otpstore)
                otpStore.set(email, {
                    otp: userRecord.otp,
                    otp_expiry: userRecord.otp_expiry,
                    verified: true,
                    verified_at: new Date()
                })
            }
        }
        // step 11: if not verified
        if (!isVerified) {
            return res.status(401).json({
                message: "Invalid OTP",
                data: null
            })
        }
        // step 12: Verification successful
        res.status(200).json({
            status: true,
            message: "OTP verified successfully!",
            data: null
        })
    }
    catch (err) {
        logError("Verify OTP error", err, res)
    }
}
const resetPassword = async (req, res) => {
    try {
        // step 1: get email, otp, password from request
        const { email, otp, password } = req.body
        // step 2: if dont have email, otp or password return 400
        if (isValid(email) || isValid(otp) || isValid(password)) {
            return res.status(400).json({
                message: "Email, OTP and password are required",
                data: null
            })
        }
        // step 3: find user in db
        const userRecord = await user.findOne({ where: { email: email } })
        if (!userRecord) {
            return res.status(404).json({
                message: "User not found",
                data: null
            })
        }
        // step 4: get otp from memory
        //otp: "123456",             // លេខកូដ ៦ ខ្ទង់ដែលបានផ្ញើទៅ email
        //otp_expiry: 1742681123456, // ពេលវេលាផុតកំណត់ (គិតជា Milliseconds)
        //verified: false,           // ស្ថានភាពនៃការផ្ទៀងផ្ទាត់ (ដំបូងគឺ false)
        //verified_at: null          // ពេលវេលាដែលបាន verify (ដំបូងគឺ null)
        const data = otpStore.get(email)
        if (!data) {
            return res.status(401).json({
                message: "No OTP found for this email",
                data: null
            })
        }
        // step 5: if otp not match
        //បើលេខកូដ មិនដូចគ្នា វានឹងបញ្ឈប់ភ្លាម រួចប្រាប់ User ថា "Invalid OTP" (លេខកូដមិនត្រឹមត្រូវ)។
        if (data.otp.toString() !== otp.toString()) {
            return res.status(401).json({
                message: "Invalid OTP",
                data: null
            })
        }
        // step 6: if otp expired
        //Check: យកម៉ោងបច្ចុប្បន្ន ធៀបនឹងម៉ោងផុតកំណត់ក្នុង RAM។
        if (Date.now() > data.otp_expiry) {
            // step 7: delete otp from memory
            otpStore.delete(email)
            return res.status(400).json({
                message: "OTP has expired",
                data: null
            })
        }
        // step 8: hash password
        const hashPassword = await bcrypt.hash(password, 10)
        // step 9: update password in db
        userRecord.password = hashPassword
        // step 10: clear otp in db
        userRecord.otp = null
        userRecord.otp_expiry = null
        await userRecord.save()
        // step 11: delete otp from memory
        otpStore.delete(email)
        // step 12: return response
        res.status(200).json({
            status: true,
            message: "Password reset successfully!",
            data: null
        })
    }
    catch (err) {
        logError("Reset Password error", err, res)
    }
}

module.exports = {
    Get,
    create,
    getOne,
    login,
    update,
    delete_user,
    sendOTP,
    verifyOTP,
    resetPassword
}
