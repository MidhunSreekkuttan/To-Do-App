import UserModel from "../data-base/models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendMail from "../config/nodeMailer.js"

export const registration = async (req, res) => {

    try {

        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: "requered credentials" })
        }

        const existUser = await UserModel.findOne({ email })
        if (existUser) {
            return res.json({ success: false, message: "User already exist" })
        }

        if (password < 8) {
            return res.json({ success: false, message: "password must contains 8 charecters" })
        }
        if (!/[A-Z]/.test(password)) {
            return res.json({ success: false, message: "password must contains a upperCase charecters" })
        }
        if (!/[a-z]/.test(password)) {
            return res.json({ success: false, message: "password must contains a lowerCase charecters" })
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return res.json({ success: false, message: "password must contains a symbol" })
        }
        if (!/[0-9]/.test(password) || password.match(/[0-9]/g).length < 3) {
            return res.json({ success: false, message: "password must contains atleast 3 number" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = new UserModel({
            name, email, password: hashPassword
        })

        await user.save()

        return res.json({ success: true, message: "User registered" })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export const login = async (req, res) => {

    try {

        const { email, password } = req.body
        if (!email) {
            return res.json({ success: false, message: "email is requered" })
        }
        if (!password) {
            return res.json({ success: false, message: "password is requered" })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const passCompare = await bcrypt.compare(password, user.password)
        if (!passCompare) {
            return res.json({ success: false, message: "Incorrect password" })
        }

        const token = await jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET)

        res.json({ success: true, message: "User LoggedIn", token, userId: user._id })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export const getUserData = async (req, res) => {

    try {

        const userId = req.userId

        const user = await UserModel.findById(userId).select("-password")
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex")

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"TaskFlow Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            text: `You are receiving this email because you (or someone else) requested a password reset for your TaskFlow account.\n\n
                Please click on the following link, or paste it into your browser to complete the process:\n\n
                    ${resetUrl}\n\n
                    This link will expire in 15 minutes.\n
                        If you did not request this, please ignore this email and your password will remain unchanged.`,
        }

        await sendMail.sendMail(mailOptions)

        res.json({ success: true, message: "Password reset link sent to your email" });

    } catch (error) {

        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = "";
            user.resetPasswordExpires = 0;
            await user.save();
        }

        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export const resetPassword = async (req, res) => {

    try {

        const { token } = req.params
        const { newPassword } = req.body

        if (!newPassword) {
            return res.json({ success: false, message: "Please provide a new password" });
        }

        // 1. Hash the incoming token so we can compare it to the one saved in the database
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: "Password reset token is invalid or has expired." });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashPassword;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = 0;

        await user.save()

        res.json({ success: true, message: "Password has been reset successfully! You can now log in." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}