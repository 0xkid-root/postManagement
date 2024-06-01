const Permission = require('../../models/permissionModel');

const {validationResult} = require('express-validator');


const addPermission = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(200).json({
                success:true,
                msg:"Errors is here !!",
                errors:errors.array()
            })
        }
        const {permission_name} = req.body;
        const isExists = await Permission.findOne({
            permission_name:{
                $regex:permission_name,
                $options:'i'
            }
        });

        if(isExists){
            return res.status(200).json({
                success:false,
                msg:"Permission already exists!!"
            })
        }

        // dynamic object ---

        var obj = {
            permission_name
        }

        if(req.body.default){
            obj.is_default = parseInt(req.body.default);
        }
        const newPermission = await new Permission( obj ).save();

        return res.status(200).json({
            success:true,
            msg:"Permission added successfully",
            data:newPermission
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const getPermissions = async(req,res)=>{
    try{

        const permissions = await Permission.find({}) // find ke ander kuch nhi dale ge to sab de dega data permission modela kaa

        return res.status(200).json({
            success:true,
            msg:"Permissions Fetched Successfully!!",
            data:permissions
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const deletePermission= async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(200).json({
                success:true,
                msg:"Errors is here !!",
                errors:errors.array()
            })
        }

        const {id} = req.body;
       const permissionData = await Permission.findByIdAndDelete({_id:id});
        console.log("permission is here:",permissionData);
        if(!permissionData){
            return res.status(500).json({
                success:false,
                msg:"Permission Data is not found!!"
            })
        }
        return res.status(200).json({
            success:true,
            msg:"Permission has been deleted successfully!!"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const updatePermission = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(200).json({
                success:true,
                msg:"Errors is here !!",
                errors:errors.array()
            })
        }

        const {id,permission_name} = req.body;

        const isExists = await Permission.findOne({_id:id});

        if(!isExists){
            return res.status(400).json({
                success:false,
                msg:"Permission ID not found !!"
            });
        }

        const isNameAssigned = await Permission.findOne({
            _id:{ $ne : id},
            permission_name
        }); // ye jo permission name hua wo kese or id ke pass nhi hone chhaiye

        if(isNameAssigned){
            return res.status(400).json({
                success:false,
                msg:"Permission name already assigned to another permission !!"
            });
        }

        const updatePermission  = {
            permission_name
        }

        if(req.body.default != null){
            updatePermission.is_default = parseInt(req.body.default) ;
        }

       const updateData = await Permission.findByIdAndUpdate({_id:id},{
            $set:updatePermission
        },{new:true});

        return res.status(200).json({
            success:true,
            msg:"Permission updated successfully!!",
            data:updateData
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:"Id is not found!!"
        })
    }
}


module.exports = {
    addPermission,
    getPermissions,
    deletePermission,
    updatePermission
}