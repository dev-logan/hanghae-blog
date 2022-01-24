const express = require('express')
const Article = require('../schemas/article')
const router = express.Router()

// 게시글 목록
router.get('/articles', async (req, res) => {
    const articles = await Article.find({},{ password: 0 }).sort({ '_id': -1 })
    res.json({
        articles
    })
})

// 게시글 상세 조회
router.get('/articles/:_id', async (req, res) => {
    const { _id } = req.params
    const [article] = await Article.find({ _id },{ password: 0 })
    res.json({
        article
    })
})

// 게시글 작성
router.post('/articles', async (req, res) => {
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

    const { author, password, title, content } = req.body
    await Article.create({ author, password, title, content, date })
    res.status(201).json({ success: true, message: '작성 완료되었습니다.' })
})

// 게시글 수정
router.put('/articles/:_id', async (req, res) => {
    const { _id } = req.params
    const { password, title, content } = req.body
    // password가 틀리면 메시지 보냄
    const [article] = await Article.find({ _id },{ password: 1 })
    if (article.password != password) {
        return res.status(400).json({ success: false })
    } else {
        await Article.updateOne({ _id, password }, {$set: { title, content }})
        res.json({ success: true, message: '게시글이 수정되었습니다.' })
    }
})

// 게시글 삭제
router.delete('/articles/:_id', async (req, res) => {
    const { _id } = req.params
    const { password } = req.body
    // password가 틀리면 메시지 보냄
    const [article] = await Article.find({ _id },{ password: 1 })
    if (article.password != password) {
        return res.status(400).json({ success: false })
    } else {
        await Article.deleteOne({ _id, password })
    }
    res.json({ success: true, message: '게시글이 삭제되었습니다.' })
})

module.exports = router