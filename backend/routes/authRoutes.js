const router = require("express").Router()
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')


router.post('/guest', (req, res) => {
    try {

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "서버 설정 오류 : JWT_SECRET이 없음" })
        }

        const uid = (req.body && req.body.deviceId) ? String(req.body.deviceId) : uuidv4()

        const token = jwt.sign(
            {uid, role:'guest'},
            process.env.JWT_SECRET,
            {expiresIn:'7d'} //7일간 유효함
        )

        res.cookie('auth',token,{
            httpOnly:true,
            sameSite:'lax',
            secure:false,
            maxAge:7*24*60*60*1000, //수명 계산을 초 단위로 함
            path:'/'
        })

        return res.status(200).json({message:'게스트 인증 완료', uid})

        

    } catch (error) {
        console.error("게스트 인증 오류", error)
        return res.status(500).json({ message: "게스트 인증 중 오류" })
    }
})

module.exports = router
