const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')


const register = async (req, res) => {
    // check if one of the values is missing
    // const {name, email, password} = req.body
    // if(!name || !email || !password) {
    //     throw new BadRequestError('Please provide name, email and password')
    // }
    // Generate salt and hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt)
    // const tempUser = {name, email, password: hashedPassword}
    
    // Create the user and respond
    const user = await User.create({...req.body})
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token })
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
const user = await User.findOne({email})
if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
}

// compare password
const isPasswordCorrect = await user.comparePassword(password)
if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
}

const token = user.createJWT();
res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}


module.exports = {
    register,
    login,
}