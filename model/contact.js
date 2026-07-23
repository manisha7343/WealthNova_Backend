const mongoose = require("mongoose")
const user = require("./user")
const contactSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId, //FK
        ref: "User", //link with user schema
        required: true
    },
    name:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    isFavorite:{
        type: Boolean,
        default: false
    },
    tags: [String]
    ,
    isDeleted:{
        type: Boolean,
        default:false
    }
    

},{timestamps:true})

const Contact = mongoose.model("Contact",contactSchema)


module.exports = Contact;


// {
//   "_id": "665d8a...",
//   "user": "665d1c...",
//   "name": "Rahul",
//   "phone": "9999999999",
//   "email": "rahul@gmail.com",
//   "isFavorite": true,
//   "tags": ["friend", "gym"]
// }