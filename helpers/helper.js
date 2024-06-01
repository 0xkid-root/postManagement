const User = require('../models/userModel');
const mongoose = require('mongoose');
const RouterPermission = require('../models/routerPermissionModel');


const getUserPermissions = async(user_id)=>{
    try{
        const user = await User.aggregate([
            {
                // yaha par jo id tha usko convert krna pada mongoose ke id me 
                // jo normal id the usko objectId me convert krna hota hai 
                $match:{
                    _id:new mongoose.Types.ObjectId(user_id)
                }
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

         return user[0]; // zero index par data hoga ----

    }catch(error){
        console.log(error.message);
    }

}

const getRouterPermission = async(routerEndPoint,role)=>{
    try{
       const routerData =  await RouterPermission.findOne({
            router_endpoint:routerEndPoint,
            role
        }).populate('permission_id');

        return routerData;

    }catch(error){
        console.log(error.message);
        return null;

    }
}

module.exports = {
    getUserPermissions,
    getRouterPermission
}