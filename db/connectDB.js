const mongoose = require('mongoose')

const connectDB = async (url) => {
    try {
        await mongoose.connect(url)
        console.log('MongoDB connected successfully')
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB