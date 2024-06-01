const User = require('../models/userModel');
const {getRouterPermission,getUserPermissions} = require('../helpers/helper')


const checkPermission = async(req,res,next) =>{
    try{
        const userData = await User.findById(req.user);


        if(userData.role != 1){ // if user not admin 


         const routerLatestData = await getRouterPermission(req.path,userData.role);
         const userPermission = await getUserPermissions(req.user);
         

         if(userPermission.permissions.permissions == undefined || !routerLatestData){
            return res.status(400).json({
                success:false,
                msg:"You have not permission to access this route!!"
            })
         }

        const permission_name =  routerLatestData.permission_id.permission_name;
        const permission_value = routerLatestData.permission;

        const hasPermission = userPermission.permissions.permissions.some(permission =>
            permission.permission_name == permission_name &&
            permission.permission_value.some(value => permission_value.includes(value))
        );

        if(!hasPermission){
            return res.status(400).json({
                success:false,
                msg:"You have not permission to access this route!!"
            })

        }        
        }

        // if user is admin then admin access all routes then go to return rext() part 
    
        return next();

    }catch(error){
        return res.status(400).json({
            success:false,
            msg:"Something Went Wrong!!"
        })
    }
}

module.exports = checkPermission;