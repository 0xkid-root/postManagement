const Post =require("../models/postModel");

const {validationResult} = require('express-validator');


const createPost = async(req,res)=>{
    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }

        const {title,description} = req.body;

        const obj ={
            title,
            description
        }
        if(req.body.categories){
            obj.categories = req.body.categories;
        }
        const postData = await new Post(obj).save();

         const postFullData = await Post.findOne({_id:postData._id}).populate('categories');
         
        return res.status(200).json({
            success:true,
            msg:"Post Created successfully!!",
            data:postFullData
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const getPosts =async(req,res)=>{
    try{
       const postData =  await Post.find({}).populate('categories');
        return res.status(200).json({
            success:true,
            msg:"Post fetch successfully!!",
            data:postData

        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message,
        })
    }
}
const deletePosts = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }

        const {id} = req.body;
        const isExists = await Post.findById({_id:id});
        if(!isExists){
            return res.status(200).json({
                success:false,
                msg:"Post data is not available!!"
            })
        }


        await Post.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            msg:"Post Data deleted successfully!!"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const updatePost = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }
        const {id,title,description} = req.body;

        const isExists = await Post.findOne({_id:id});

        if(isExists){
            return res.status(400).json({
                success:false,
                msg:"Post does not exist",
            })
        }

        var updateObj = {
            title,
            description
        }

        if(req.body.categories){
            updateObj.categories = req.body.categories;
        }

        const postData = await Post.findByIdAndUpdate({_id:id},{
            $set:updateObj
        },{new:true})

        return res.status(200).json({
            success:false,
            msg:"Updated post successfully",
            data:postData
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })

    }
}

 


module.exports = {
    createPost,
    getPosts,
    deletePosts,
    updatePost,

}