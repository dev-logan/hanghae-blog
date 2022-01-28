const express = require('express')
const User = require('../schemas/user')
const router = express.Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken')

//  회원 가입 양식
const postUsersSchema = Joi.object({
    nickname: Joi
    .string()
    .required()
    .pattern(new RegExp('[a-zA-Z0-9가-힣]{2,}')),
    password: Joi
    .string()
    .required()
    .min(4),
    confirmPassword: Joi.string().required(),
})

//  회원 가입
router.post("/users", async (req, res) => {
    try {
        const { nickname, password, confirmPassword } = await postUsersSchema.validateAsync(req.body)

        //  비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            return res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.'
            })
        }

        //  비밀번호에 닉네임과 같은 값이 포함된 경우
        if (password.includes(nickname)) {
            return res.status(400).send({
                errorMessage: '비밀번호가 안전하지 않습니다.'
            })
        }

        //  닉네임 중복 확인
        const existUsers = await User.find({ nickname })
        if (existUsers.length) {
            return res.status(400).send({
                errorMessage: '닉네임이 중복됩니다.'
            })
        }

        // DB에 회원정보 입력
        const user = new User({ nickname, password });
        await user.save();
        res.status(201).send({})

    } catch (error) {
        return res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.'
        })
    }
})

//  로그인
router.post("/auth", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname, password })

    if (!user) {
        return res.status(400).send({
            errorMessage: '닉네임 또는 비밀번호를 확인해주세요.'
        })
    }

    const token = jwt.sign({ nickname: user.nickname }, 'kim-jeong-ho-5901')
    res.send({ token })
})

module.exports = router