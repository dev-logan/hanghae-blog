const mongoose = require('mongoose')

// ec2 데이터베이스
const connect = () => {
    mongoose.connect('mongodb://test:test@54.180.108.6:27017/hanghae_blog?authSource=admin', { ignoreUndefined: true }).catch((err) => {
        console.error(err)
    })
}

// 로컬 데이터베이스
// const connect = () => {
//     mongoose.connect('mongodb://localhost:27017/hanghae_blog', { ignoreUndefined: true }).catch((err) => {
//         console.error(err)
//     })
// }

module.exports = connect