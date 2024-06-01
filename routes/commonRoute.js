const express = require('express')
const commonRoute = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const {categoryAddValidator,categoryDeleteValidator,categoryUpdateValidator,postCreateValidator,postDeleteValidator,postUpdateValidator} = require('../helpers/adminValidator');
const {addCategory,getCategory,deleteCategory,updateCategory} = require('../controllers/categoryController')
const {createPost,getPosts,deletePosts,updatePost } = require('../controllers/postController');
const {createUserValidator,updateUserValidator,deleteUserValidator,postLikeUnlikeValidator,postLikeCountValidator} = require('../helpers/Validator');
const {createUser,getUsers,updateUser,deleteUser} = require('../controllers/userController');
const {postLike,postUnLike,postLikeCount} = require('../controllers/likeController');
const checkPermission = require('../middlewares/checkPermission');
//category routes is here --

commonRoute.post('/add-category',verifyToken,checkPermission,categoryAddValidator,addCategory)
commonRoute.get('/get-category',verifyToken,checkPermission,getCategory)
commonRoute.post('/delete-category',verifyToken,checkPermission,categoryDeleteValidator,deleteCategory)
commonRoute.post('/update-category',verifyToken,checkPermission,categoryUpdateValidator,updateCategory)

// post routes is here ------------
commonRoute.post('/create-post',checkPermission,verifyToken,postCreateValidator,createPost)
commonRoute.get('/get-posts',checkPermission,verifyToken,getPosts)
commonRoute.post('/delete-posts',checkPermission,verifyToken,postDeleteValidator,deletePosts)
commonRoute.post('/update-posts',checkPermission,verifyToken,postUpdateValidator,updatePost)

//user routes is here ------
commonRoute.post('/create-user',verifyToken,checkPermission,createUserValidator,createUser)
commonRoute.get('/get-users',verifyToken,checkPermission,getUsers)
commonRoute.post('/update-user',verifyToken,checkPermission,updateUserValidator,updateUser)
commonRoute.post('/delete-user',verifyToken,checkPermission,deleteUserValidator,deleteUser)

// like and unlike routes is here
commonRoute.post('/post-like',verifyToken,checkPermission,postLikeUnlikeValidator,postLike)
commonRoute.post('/post-unlike',verifyToken,checkPermission,postLikeUnlikeValidator,postUnLike)
commonRoute.post('/post-like-count',verifyToken,checkPermission,postLikeCountValidator,postLikeCount)





module.exports = commonRoute