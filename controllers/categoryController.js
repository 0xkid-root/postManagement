const Category = require('../models/categoryModel');

const {validationResult} = require('express-validator');

const addCategory = async(req,res)=>{
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors is here",
                errors:errors.array()
            });
        }
        const {category_name} = req.body;

        const isExistsCategory = await Category.findOne({
            name: category_name
        });
        if(isExistsCategory){
            return res.status(200).json({
                success:true,
                msg:"Category already exists!!"
            })
        }
        const categoryData =await new Category({
            name: category_name
        }).save();
        return res.status(200).json({
            success:true,
            msg:"Category created successfully!!",
            data: categoryData
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}
const getCategory = async(req,res)=>{
    try{
        const categoryData = await Category.find();

        return res.status(200).json({
            success:true,
            msg:"Category fetched successfully!!",
            data: categoryData
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:"Something went wrong!!"
        })
    }
}

const deleteCategory = async(req,res)=>{
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
        console.log("id is here:",id);

        const categoryData = await Category.findById({_id:id});
        console.log("categoryData is here:",categoryData)

        if(!categoryData){
            return res.status(500).json({
                success:false,
                msg:"Category is not available!!"
            })
        }

        await Category.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            msg:"Category deleted successfully!!"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

const updateCategory =async(req,res)=>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(200).json({
                success:true,
                msg:"Errors is here !!",
                errors:errors.array()
            })
        }

        const {id,category_name} = req.body;

        const categoryData = await Category.findOne({_id:id});

        if(!categoryData){
            return res.status(400).json({
                success:false,
                msg:"Category ID doesn't exists!!"
            });
        }

        const isExists = await Category.findOne({
            _id:{$ne:id},
            name:{
                $regex:category_name,
                $options:'i'
            }
        })
        if(isExists){
            return res.status(400).json({
                success:false,
                msg:"Category name already assigned to another category!!"
            })
        }

        const updateData = await Category.findByIdAndUpdate({_id:id},{
            $set:{name:category_name}
        },
        {new:true}
        )

        return res.status(200).json({
            succes:true,
            msg:"Category Update Successfully",
            data:updateData
        })



    }catch(error){
        return res.status(500).json({
            success:false,
            msg:error.message
        })
    }
}

module.exports = {
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory
}