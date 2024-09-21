const User = require('../model/userSchema')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const asyncWrapper = require('../middleware/asyncWrapper')

const register = asyncWrapper(async (req, res) => {
    console.log(req)
    const user = await User.create({ ...req.body })
    const token = await user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { userName: user.userName, email: user.email }, token })
})

const login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const isPasswordCorrect = await user.passwordChecking(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT();
    res.status(200).json({ user: { userName: user.userName, email: user.email }, token });
})

module.exports = {
    register,
    login
}