const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Please provide username'],
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, userName: this.userName },
        KmDrEgqFmCKcbwEz85B4FrBKBInMCu2W,
        {
            expiresIn: '30d',
        }
    )
}

userSchema.methods.passwordChecking = async function (userPassword) {
    const match = await bcrypt.compare(userPassword, this.password)
    return match
}

module.exports = mongoose.model('User', userSchema)