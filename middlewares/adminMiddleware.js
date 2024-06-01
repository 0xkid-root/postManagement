const User = require('../models/userModel');
const onlyAdminAccess = async(req,res,next)=>{
    try{
         const userId = req.user;
         console.log("req.user is here",userId);
         const userData = await User.findById(userId).select("-password");
         console.log("userData is here",userData);

         if(userData.role != 1){
            return res.status(400).json({
                success:false,
                msg:"You haven't permission to access this route!!"
            })

         }

    }catch(error){
        return res.status(400).json({
            success:false,
            msg:"Something went wrong!!"
        })
    }
   return next();
}

module.exports =onlyAdminAccess
