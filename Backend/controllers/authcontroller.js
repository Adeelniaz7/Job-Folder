const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req,res)=>{
    try {
        const {name,email,password,role}= req.body
        
        // Check karo ky user already exists to ni ha
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message:'Email already exists'})
        }
        // Password encrypt karny ky liay
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // User bano 
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        })
        return res.status(201).json({message:'User registered successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const login = async (req,res) =>{
    try {
        const {email,password}= req.body

        const user = await User.findOne({email})
        if(!user) {
           return res.status(404).json({message:'user not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
           return res.status(404).json({message:'Invalid credentials'})
        }
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports = {register,login}