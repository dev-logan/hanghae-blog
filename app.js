const express = require('express')
const connect = require('./schemas')
const app = express()
const port = 3000

connect()

const articlesRouter = require('./routes/articles')

//  미들웨어
// app.use(express.static('static'))
app.use(express.json())
app.use('/api', [articlesRouter])

//  서버 켜기
app.listen(port, () => {
    console.log(port, '포트 서버 ON')
})