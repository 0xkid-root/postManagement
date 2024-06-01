const Role = require('../../models/roleModel');
const {validationResult} = require('express-validator');


const storeRole = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }
        const {role_name, value} = req.body;

        const roleData = await new Role({role_name, value}).save();

        return res.status(200).json({
            success:true,
            msg:"Role Created Successfully",
            data:roleData
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            msg:error.message
        })
    }
}


const getRoles = async(req,res)=>{
    try{
        const roleData = await Role.find({value:{$ne:1}});

        return res.status(200).json({
            success:true,
            msg:"Role Data Fetch Successfully!!",
            data:roleData
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            msg:error.message
        })
    }

}
module.exports = {
    storeRole,
    getRoles,

}