const express = require('express')
const Comment = require('../schemas/comment')
const router = express.Router()
const authMiddleware = require('./auth-middleware')

//  댓글 작성
router.post('/comments', authMiddleware, async (req, res) => {
    // 오늘 날짜 입력
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    let date
    if (month < 10) {
        date = year + '-' + '0' + month + '-' + day
    } else {
        date = year + '-' + month + '-' + day
    }

    const password = 0
    const author = res.locals.user[0].nickname

    const { content, articleId } = req.body
    if (!(content && articleId)) {
        return res.status(400).json({ success: false, errorMessage: '내용을 입력해주세요.' })
    }
    await Comment.create({ articleId, author, password, content, date })
    res.status(201).json({ success: true, message: '댓글이 등록되었습니다.' })
})

//  댓글 목록 조회
router.get('/comments/:articleId', async (req, res) => {
    const { articleId } = req.params
    const comments = await Comment.find({ articleId }, { password: 0 }).sort({ '_id': 1 })
    res.json({
        comments
    })
})

//  댓글 수정
router.put('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    if (!(content)) {
        return res.status(400).json({ success: false })
    }
    // password가 틀리면 메시지 보냄
    // const [comment] = await Comment.find({ _id }, { password: 1 })
    // if (comment.password != password) {
    //     return res.status(400).json({ success: false })
    // }

    const author = res.locals.user[0].nickname
    const comment = await Comment.findOne({ _id: commentId, author })
    if (!comment) {
        return res.status(400).send({ errorMessage: '본인의 댓글이 아닙니다.' })
    }

    await Comment.updateOne({ _id: commentId, author }, { $set: { content } })
    res.json({ success: true, message: '댓글이 수정되었습니다.' })
})

//  댓글 삭제
router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params
    // const { password } = req.body
    // if (!password) {
    //     return res.status(400).json({ success: false })
    // }
    // password가 틀리면 메시지 보냄
    // const [comment] = await Comment.find({ _id }, { password: 1 })
    // if (comment.password != password) {
    //     return res.status(400).json({ success: false })
    // }
    const author = res.locals.user[0].nickname
    await Comment.deleteOne({ _id: commentId, author })
    res.json({ success: true, message: '댓글이 삭제되었습니다.' })
})

// 특정 게시글의 댓글 수 세기
router.get('/articles/:articleId/comments', async (req, res) => {
    const { articleId } = req.params
    const comments = await Comment.find({ articleId })
    res.json({ count: comments.length })
})

module.exports = router