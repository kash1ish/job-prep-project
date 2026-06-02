const userModel = require("../models/User.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUserController(req, res){
    const {username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Invalid Credentials",
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User Already Exists",
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, 
        email, 
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.SECRET_KEY,
        {expiresIn: "1d" }
    )

    res.cookie("token", token);
    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username,
            email
        }
    })
}

async function loginUserController(req,res){
    const {email, password} = req.body;

    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.SECRET_KEY,
        {expiresIn: "1d" }
    )

    res.cookie("token", token);
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController
}