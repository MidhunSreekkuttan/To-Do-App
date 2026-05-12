import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

    try {

        const { UserLogin } = req.cookies
        if (!UserLogin) {
            return res.json({ success: false, message: "Something went wrong plz login again" })
        }

        const verifyToken = await jwt.verify(UserLogin, process.env.JWT_SECRET)
        if (!verifyToken) {
            return res.json({ success: false, message: "Access denide" })
        } else {
            if (verifyToken.id) {
                req.userId = verifyToken.id
            }
        }

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export default userAuth