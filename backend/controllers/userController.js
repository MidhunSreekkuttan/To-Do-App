import UserModel from "../data-base/models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

        await jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET)

        res.json({ success: true, message: "User LoggedIn" })

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