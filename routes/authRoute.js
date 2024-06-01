const express = require('express')
const authRouter = express();
const {registerUser,loginUser,getProfile,getUserRefreshPermissions} = require('../controllers/authController');
const {registerValidator,loginValidator} = require('../helpers/Validator');
const verifyToken = require('../middlewares/authMiddleware');

authRouter.post('/register',registerValidator,registerUser)
authRouter.post('/login',loginValidator,loginUser)
authRouter.get('/profile',verifyToken,getProfile)

authRouter.get('/refresh-permissions',verifyToken,getUserRefreshPermissions)

module.exports = authRouter;


