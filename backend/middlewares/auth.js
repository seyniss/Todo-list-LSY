const jwt = require("jsonwebtoken")


<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
module.exports = (req, res, next) => {
    const token = req.cookies?.auth

    if (!token) return res.status(401).json({ message: '인증 필요 토큰 없음' })

    try {
        const playload = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
<<<<<<< Updated upstream
        req.user =playload
        next()
    } catch (error) {
        return res.status(401).json({message:'유효하지 않은 토큰'})
    }

=======
        req.user = playload
        next()
    } catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰' })
    }
>>>>>>> Stashed changes
}