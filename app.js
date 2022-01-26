const express = require('express')
const connect = require('./schemas')
const cors = require('cors')
const app = express()
const port = 3000

connect()

const articlesRouter = require('./routes/articles')

//  bodyParser
// const bodyParser = require('body-parser')
// app.use(bodyParser.json())

//  미들웨어
app.use(cors())
app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded())

app.use('/api', [articlesRouter])

//  서버 켜기
app.listen(port, () => {
    console.log(port, '포트 서버 ON')
})