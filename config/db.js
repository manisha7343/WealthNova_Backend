const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongose connected")
    } catch(error){
        console.log("connection problem",error);
    }
}

module.exports = connectDB;

