const mongoose = require("mongoose");


const DbConnect = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("databse connectd is successfully !!");

    }catch(error){
        console.log(error);
    }
}

module.exports = DbConnect;