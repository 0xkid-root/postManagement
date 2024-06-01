const Like = require('../models/likeModel');
const {validationResult} = require('express-validator');

const postLike = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        const {user_id,post_id} = req.body;
        const isLikeData = await Like.findOne({user_id,post_id});

        if(isLikeData){
            return res.status(400).json({
                success:false,
                msg:"User Already Liked!!"
            })
        }
        const likeData = await new Like({
            user_id,post_id
        }).save();
        console.log("likedata is here:",likeData);

        const finalLikeData = await Like.findOne({_id:likeData._id}).populate('post_id');

        return res.status(200).json({
            success:true,
            msg:"Post liked!!",
            data:finalLikeData
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}


const postUnLike = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        const {user_id,post_id} = req.body;
        const isLikeData = await Like.findOne({user_id,post_id});

        if(!isLikeData){
            return res.status(400).json({
                success:false,
                msg:"You have not liked!!"
            });
        }

        await Like.deleteOne({
            user_id,
            post_id
        })

        return res.status(200).json({
            success:true,
            msg:"Post unliked!!"
        });


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const postLikeCount = async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }
        const {post_id} = req.body;

        const likeCount = await Like.find({
            post_id
        }).countDocuments();
        return res.status(200).json({
            success:true,
            data:likeCount,
            msg:"Like count fetch successfully!!"

        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}


module.exports = {
    postLike,
    postUnLike,
    postLikeCount
}