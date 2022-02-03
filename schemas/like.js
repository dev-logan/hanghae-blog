const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    articleId: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Like', commentSchema)