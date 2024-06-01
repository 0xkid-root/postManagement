const jwt= require('jsonwebtoken');

const verifyToken = async(req,res,next)=>{
    try{
        const token = req.body.token || req.query.token || req.headers['authorization'];

        if(!token){
            return res.status(400).json({
                success:false,
                msg: "A Token Is Required For Authentication",
            });
        }

        const bearerToken = token.split(" ")[1];
        const decodedData = await jwt.verify(bearerToken,process.env.ACCESS_SECRET_KEY);
        console.log("hello this is userid:",decodedData.user);
        req.user =decodedData.user; 

    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            msg:"Invalide Token"
        })
    }
    return next();
}

module.exports = verifyToken;
