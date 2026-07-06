import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

    try {

        const loginToken = req.headers.authorization
        if (!loginToken) {
            return res.json({ success: false, message: "Something went wrong plz login again" })
        }

        const decodeToken = jwt.decode(loginToken, process.env.JWT_SECRET)
        if (!decodeToken) {
            return res.json({ success: false, message: "Access denide" })
        } else {
            if (decodeToken.id) {
                req.userId = decodeToken.id
            }
        }

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export default userAuth