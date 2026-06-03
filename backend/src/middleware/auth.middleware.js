const jwt = require("jsonwebtoken");

function authUser(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: "Unauthorized"
            })
        } else {
            req.user = decoded;
            next();
        }
    })}catch(err){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = {
    authUser
}