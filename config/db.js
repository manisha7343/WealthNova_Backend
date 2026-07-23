const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoBD Connected !!")
    } catch(error){
        console.log("connection problem", error);
    }
}

module.exports = connectDB;

