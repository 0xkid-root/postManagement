const express = require('express')
const adminRouter = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {permissionAddValidator,permissionDeleteValidator,permissionUpdateValidator,storeRoleValidator,addRouterPermissionValidator,getRouterPermissionValidator} = require('../helpers/adminValidator');
const {addPermission,getPermissions,deletePermission,updatePermission} = require('../controllers/admin/permissionController');
const onlyAdminAccess = require('../middlewares/adminMiddleware');
const {getRoles,storeRole } = require('../controllers/admin/roleController'); 
const {addRouterPermission,getRouterPermission} = require('../controllers/admin/routerController')

// permission routes 

adminRouter.post('/add-permission',verifyToken,onlyAdminAccess,permissionAddValidator,addPermission)
adminRouter.get('/get-permission',verifyToken,onlyAdminAccess,permissionAddValidator,getPermissions)
adminRouter.post('/delete-permission',verifyToken,onlyAdminAccess,permissionDeleteValidator,deletePermission)
adminRouter.post('/update-permission',verifyToken,onlyAdminAccess,permissionUpdateValidator,updatePermission)

adminRouter.post('/store-role',verifyToken,onlyAdminAccess,storeRoleValidator,storeRole)
adminRouter.get('/get-roles',verifyToken,onlyAdminAccess,getRoles)

// router permission routes --- 

adminRouter.get('/add-router-permission',verifyToken,onlyAdminAccess,addRouterPermissionValidator,addRouterPermission)
adminRouter.get('/get-router-permission',verifyToken,onlyAdminAccess,getRouterPermissionValidator,getRouterPermission)



module.exports = adminRouter;


