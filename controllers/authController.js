const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const {getUserPermissions} = require('../helpers/helper');


const registerUser = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }
        const {name,email,password} = req.body;

        const isExistUser = await User.findOne({email});

        if(isExistUser){
            return res.status(200).json({
                success:true,
                msg:"Email Already Registered!!",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
 
        const userData = await new User({
            name,
            email,
            password: hashedPassword
        }).save();
        
        const finalData = await User.findOne({email}).select("-password")
// assign default permissions =============
        
        const defaultPermissions = await Permission.find({
            is_default:1
        });

        if(defaultPermissions.length > 0 ){
            // koi na koi permission hai hee yaha parr 

            const permissionArray = [];
            defaultPermissions.forEach(permission =>{
                permissionArray.push({
                    permission_name:permission.permission_name,
                    permission_value:[0,1,2,3]
                });
            });

            const userPermission = await new UserPermission({
                user_id:finalData._id,
                permissions:permissionArray
            }).save();

        }       
        return res.status(200).json({
            success:true,
            msg:"User Registered Successfully!!",
            user:finalData
        })

    }catch(error){
        return res.status(400).josn({
            success:false,
            msg:error.message
        })
    }
}

const generateAccessToken = async(user)=>{
    const accessToken = await jwt.sign(user,process.env.ACCESS_SECRET_KEY,{expiresIn:'2h'});
    return accessToken;

}

const loginUser = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"error is here",
                errors:errors.array()
            });
        }

        const {email,password} = req.body;
        console.log(email,password);

        const userData = await User.findOne({email});
        console.log("userData is here:",userData);
        if(!userData){
            return res.status(400).json({
                success:false,
                msg:"Email & password is incorrect !!",
            })
        }

       const isPasswordMatch = await bcrypt.compare(password,userData.password);
       console.log("is passowrd fuck ",isPasswordMatch);

       if(!isPasswordMatch){
        return res.status(400).json({
            success:false,
            msg:"Email & password is incorrect!!"
        })
       }

       const accessToken = await generateAccessToken({user:userData._id})

       const finalData = await User.findOne({email}).select("-password");

       // get user data with all permissions  --
      const result = await User.aggregate([
        {
            $match:{email:finalData.email}
        },
        {
            $lookup:{
                from:"userpermissions",
                localField:"_id",
                foreignField:"user_id",
                as:"permissions"
            }
        },
        {
            $project:{
                _id:0,
                name:1,
                email:1,
                role:1,
                permissions:{
                    $cond:{
                        if: {$isArray:"$permissions"},
                            then:{$arrayElemAt : [ "$permissions", 0]},
                            else:null

                    }
                }

            }
        },
        {
            $addFields:{
                "permissions":{
                    "permissions":"$permissions.permissions"
                }
            }
        }


       ])  

       return res.status(200).json({
        success:true,
        msg:"Login successful!!",
        user:result,
        accessToken:accessToken
       })
    }catch(error){
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const getProfile= async(req,res)=>{
    try{
        const userId = req.user;
        console.log("userid is here:",userId)
        const userData = await User.findById(userId).select("-password");
        if(!userData){
            return res.status(404).json({
                success:false,
                msg:"UserData not found!!"
            });
        }

        return res.status(200).json({
            success:true,
            msg:"Data fetch sucessfully!!",
            data:userData
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const getUserRefreshPermissions = async(req,res)=>{
    try{
        const user_id = req.user;
        const userPermissionData = await getUserPermissions(user_id);

        return res.status(200).json({
            success:true,
            msg:"User Permissions!!",
            data:userPermissionData
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }

}


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getUserRefreshPermissions
}