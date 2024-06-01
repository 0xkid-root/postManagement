const {validationResult} = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const {sendMail} = require('../helpers/mailer');
const mongoose = require('mongoose'); 
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');


const createUser = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }

        const {name,email} = req.body;
        const isExists = await User.findOne({
            email
        });

        if(isExists){
            return res.status(400).json({
                success:false,
                msg:"Email is already exists!!"
            });
        }

        const password = randomstring.generate(6);
        const hashPassword = await bcrypt.hash(password,10);

        var obj = {
            name,
            email,
            password:hashPassword
        }
        if(req.body.role  && req.body.role == 1){
            return res.status(200).json({
                success:false,
                msg:"You can't create admin!!"
            });
        }
        else if(req.body.role){ 
            // yaha role kuch or aata to add kar diya
            obj.role = req.body.role
        }
        const user = new User(obj);

        const userData = await user.save();
// add permissions to user if coming in request --
         if(req.body.permissions != undefined && req.body.permissions.length > 0){

             const addPermission = req.body.permissions;

             const permissionArray = [];

            await Promise.all(addPermission.map(async(permission)=>{

                const permissionData = await Permission.findOne({_id:permission.id});

                permissionArray.push({
                    permission_name:permissionData.permission_name,
                    permission_value:permission.value
                })

             }));

             const userPermission =await  new UserPermission({
                user_id:userData._id,
                permissions:permissionArray
             });
             await userPermission.save();

         }


        console.log("password is here:",password);

        const content = `
        <p>Hii <b>`+userData.name +`,</b>Your account is created, below is your details. </p>
        <table style="border-style:none;">
        <tr>
        <th>Name:-</th>
        <td>`+userData.name+`</td>
        </tr>

        <tr>
        <th>Email:-</th>
        <td>`+userData.email+`</td>
        </tr>
        
        <tr>
        <th>Password:-</th>
        <td>`+password+`</td>
        </tr>        
        </table>

        <p>Now you can login your account in our Application, Thanks....</p>
        `;

        sendMail(userData.email,'Account Created',content)



        return res.status(200).json({
            success:true,
            msg:"user created successfully!",
            data:userData
        })
         

    }catch(error){
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const getUsers = async(req,res) =>{
    try{

        console.log("here here here",req.user);
        // const userData = await User.find({
        //     _id:{$ne:req.user}
        // }) 
        
        // is id ko ignore kare bakki jitne id hai sab ka data de doo ------

  // get user data with all permissions  --
  const result = await User.aggregate([
    {
        // yaha par jo id tha usko convert krna pada mongoose ke id me 
        // jo normal id the usko objectId me convert krna hota hai 
        $match:{_id:{$ne:new mongoose.Types.ObjectId(req.user)}}
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
 ]) ;

        return res.status(200).json({
            success:true,
            msg:"Data Fetch Successfully!!",
            data: result
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
} 

const updateUser = async(req,res)=>{
    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }

        const {id,name} = req.body;
        const isExists = await User.findById({
            _id:id
        });
        
        console.log("is exists is here:",isExists);

        if(!isExists){
            return res.status(400).json({
                success:false,
                msg:"User not exists!!",
            });
        }

        // agar user same name baar baar update kare to kaise condation dalee 


        if(isExists.name == name){
            return res.status(400).json({
                success:false,
                msg:"same name baar baar nhi vej sakte hai "
            })

        }

        var updateObj = {
            name
        }

        if(req.body.role != undefined){
            updateObj.role = req.body.role;
        }

        const updatedData = await User.findByIdAndUpdate({_id:id},
            {
                $set:updateObj
            },{new:true});

            // add permissions to user if coming in request --
         if(req.body.permissions != undefined && req.body.permissions.length > 0){

            const addPermission = req.body.permissions;

            const permissionArray = [];

           await Promise.all(addPermission.map(async(permission)=>{

               const permissionData = await Permission.findOne({_id:permission.id});

               permissionArray.push({
                   permission_name:permissionData.permission_name,
                   permission_value:permission.value
               })

            }));

           await UserPermission.findOneAndUpdate(
            {user_id:updatedData._id},
            {permissions:permissionArray},
            {upsert:true,new:true,setDefaultsOnInsert:true},

            );
        }

        return res.status(200).json({
            success:true,
            msg:"User updated successfully!!",
            data:updatedData
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const deleteUser = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        const {id} = req.body;

        const isExists = await User.findOne({_id:id});

        if(!isExists){
            return res.status(400).json({
                success:false,
                msg:"Id is not found!!"
            })
        }

        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            msg:"User deleted successfully!!"
        });


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })

    }
}


module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
}