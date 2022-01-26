const express = require('express')
const Comment = require('../schemas/comment')
const router = express.Router()

//  댓글 작성
router.post('/comments', async (req, res) => {
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
    const { author, password, content, articleId } = req.body
    if (!(author && password && content && articleId)) {
        return res.status(400).json({ success: false })
    }
    await Comment.create({ articleId, author, password, content, date })
    res.status(201).json({ success: true, message: '댓글이 등록되었습니다.' })
})

//  댓글 목록 조회
router.get('/comments/:articleId', async (req, res) => {
    const { articleId } = req.params
    const comments = await Comment.find({ articleId },{ password: 0 }).sort({ '_id': 1 })
    res.json({
        comments
    })
})

//  댓글 수정
router.put('/comments/:commentId', async (req, res) => {
    const { _id } = req.params
    const { password, content } = req.body
    if (!(password && content)) {
        return res.status(400).json({ success: false })
    }
    // password가 틀리면 메시지 보냄
    const [comment] = await Comment.find({ _id },{ password: 1 })
    if (comment.password != password) {
        return res.status(400).json({ success: false })
    } else {
        await Comment.updateOne({ _id, password }, {$set: { content }})
        res.json({ success: true, message: '댓글이 수정되었습니다.' })
    }
})

//  댓글 삭제
router.delete('/comments/:commentId', async (req, res) => {
    const { _id } = req.params
    const { password } = req.body
    if (!password) {
        return res.status(400).json({ success: false })
    }
    // password가 틀리면 메시지 보냄
    const [comment] = await Comment.find({ _id },{ password: 1 })
    if (comment.password != password) {
        return res.status(400).json({ success: false })
    } else {
        await Comment.deleteOne({ _id, password })
        res.json({ success: true, message: '댓글이 삭제되었습니다.' })
    }
})

module.exports = router