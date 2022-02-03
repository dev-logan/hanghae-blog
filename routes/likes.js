const express = require('express')
const Like = require('../schemas/like')
const router = express.Router()
const authMiddleware = require('./auth-middleware')

// 좋아요
router.post('/likes', authMiddleware, async (req, res) => {
    const nickname = res.locals.user[0].nickname
    const { articleId } = req.body

    await Like.create({ nickname, articleId })
    res.status(201).send()
})

// 좋아요 취소
router.delete('/likes', authMiddleware, async (req, res) => {
    const nickname = res.locals.user[0].nickname
    const { articleId } = req.body

    await Like.deleteOne({ nickname, articleId })
    res.status(200).send()
})

// 사용자가 해당 글에 좋아요를 했는지 안 했는지
router.get('/likes/:articleId', authMiddleware, async (req, res) => {
    const nickname = res.locals.user[0].nickname
    const { articleId } = req.params

    const like = await Like.findOne({ nickname, articleId })
    if (like) {
        res.status(200).json({ likeStatus: true })
    } else {
        res.status(200).json({ likeStatus: false })
    }
})

// 특정 글의 좋아요 개수
router.get('/likes/:articleId/count', async (req, res) => {
    const { articleId } = req.params
    const likes = await Like.find({ articleId })
    res.json({ count: likes.length })
})

module.exports = router