

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

router.post('/guest', (req, res) => {
    try {
        // 1) 필수 환경변수 점검
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: '서버 설정 오류: JWT_SECRET이 없습니다.' });
        }

        // 2) deviceId 사용(없으면 uuid 발급)
        const uid = (req.body && req.body.deviceId) ? String(req.body.deviceId) : uuidv4();

        // 3) 토큰 발급
        const token = jwt.sign(
            { uid, role: 'guest' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 4) HttpOnly 쿠키 설정
        res.cookie('auth', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: false, // 프로덕션(HTTPS)에서는 true 권장
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',     // 필요시 스코프 조정
        });

        return res.status(200).json({ message: '게스트 인증 완료', uid });
    } catch (err) {
        console.error('게스트 인증 오류:', err);
        return res.status(500).json({ message: '게스트 인증 중 서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
