const { log } = require("console");
const Contact = require("../model/contact");
const mongoose = require("mongoose");

//POST : add new user   #############################################
// OK
const createContact = async (req, res) => {
  try {
    const { name, phone, email, isFavorite, tags } = req.body;
    
    //DB - create contact 🔴

    const contactData = {
      user: req.user,
      name:name,
      phone:phone,
      email:email,
      isFavorite: isFavorite,
      tags: tags || []
    };

    const result = await Contact.create(contactData);

    // console.log("isFavorite:", isFavorite);
    // console.log("reques body:", req.body);
    // console.log("contact created  : ",result);
    // console.log("owner : ",req.user);

    //terminal res
    if (!result || !result._id) {
      console.log("unable to create contact");
      return res.status(404).json({
        success: false,
        message: "unable to save contact",
      });
    } else {
      console.log("contact saved successfully!", result._id);
      return res.status(201).json({
        success: true,
        message: "contact saved successfully!",
        contact: result,
      });
    }

    //---------------------------------------------
  } catch (error) {
    console.log("contact create error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating contact. Please try again later.",
    });
  }
};

// const createContact = (req, res) => {
//   const { name, phone, email, isFavorite, tags } = req.body;

//   const contactData = {
//     user: req.user,
//     name: name,
//     phone: phone,
//     email: email,
//     isFavorite: isFavorite,
//     tags: tags || [],
//   };

//   // Contact.create() Promise return karta hai
//   // hum .then() aur .catch() se callback jaisa behaviour banayenge
//   Contact.create(contactData)
//     .then(function (result) {

//       // ❌ result nahi aaya
//       if (!result || !result._id) {
//         console.log("unable to create contact");
//         return res.status(404).json({
//           success: false,
//           message: "unable to save contact",
//         });
//       }

//       // ✅ Success
//       console.log("contact saved successfully!", result._id);
//       return res.status(201).json({
//         success: true,
//         message: "contact saved successfully!",
//       });

//     })
//     .catch(function (error) {

//       // ❌ DB error
//       console.log("contact create error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong while creating contact. Please try again later.",
//       });

//     });
// };






// OK
// GET : find #####################################################

const getContacts = async (req, res) => {
  try {
  
    const filter ={
     user:req.user,
     isDeleted:false
    }
    
    //fav constact 
    if(req.query.isFavorite !== undefined){
       filter.isFavorite = true;
    }

    //serch contatcs
    if (req.query.search) {
   filter.name = { $regex: req.query.search, $options: "i" };
    }

    console.log("Query:", req.query.isFavorite);
    console.log("Filter:", filter);

    //pagination----------------

    const total = await Contact.countDocuments(filter);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //-------------------------

    //DB - getAllContacts 🔴
    const result = await Contact.find(
      filter, //specific user ka all contact
      { user: 0, __v: 0, isDeleted: 0 },
    ).sort({ name: 1 }).skip(skip).limit(limit); 


    // no contacts found
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "no contacts found",
        data: [],
        page,
        limit,
        totalPages:0
      });
    } else {
      console.log("contact fetched successfully");
      return res.status(200).json({
        success: true,
        msg: "your contacts",
        page,
        limit,
        total,
        totalPages: Math.ceil(total/limit),
        data: result,
      });
    }
    // console.log("your All contacts: ", result);
    // console.log("Owner:",req.user);

    //----------------------------------------
  } catch (error) {
    console.log("Error in get contacts :", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching ocntacts. Please try again later.",
    });
  }
};

// GET : findById ################################################
// NOT OK
const getContactById = async (req, res) => {
  try {
 
    const contactId = req.params.id;

    // validation - ID formate
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        sucess:false,
        message: "Invalid contact ID",
      });
    }

    let query = {
      _id:contactId,
      user:req.user, 
      isDeleted:false
      }

    //DB - getContactByID using findById 🔴
    const result = await Contact.findOne(
      query,
      { user: 0, __v: 0, isDeleted: 0 }
    
    );
  
    // Success
    if(!result){
    console.log("contact not found");
    return res.status(404).json({
      success:false,
      message:"contact not found"
    }) 
    }
    console.log("contact fetched successfully! : ", result);
    return res.status(200).json({
      success: true,
      message: "contact fetched By ID successfully",
      data: result,
    });
    
    
  } catch (error) {
    console.log("Error to fetch contact:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching ocntact. Please try again later.",
    });
  }
};

//PUT : findByIdAndUpdate ############################################################3
// OK
const updateContact = async (req, res) => {
  try {

    const contactId = req.params.id;
    const { name, phone, email, isFavorite, tags, isDeleted } = req.body;

    //validation - ID formate
    if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        sucess:false,
        message: "Invalid contact ID",
      });
    }

    const query ={
      name:name,
      phone:phone,
      email:email,
      isFavorite:isFavorite,
      tags: tags
    };

    if(req.body.isDeleted !== undefined){
      query.isDeleted = req.body.isDeleted;
    }
 

    //DB - upadate contact🔴
    const result = await Contact.updateOne(
      { _id: contactId, user: req.user}, // filter
      { 
        $set: 
          query
        
      }, 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "contact not found for updation",
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "contact updated successfully!!",
      });
    }

    // if (result.matchedCount && result.modifiedCount > 0) {
    //   consolelog("contact updated successfully!")
    //   return res.status(200).json({
    //     success: true,
    //     message: "contact updated successfully",
    //   });
    // } else {
    //   console.log("contact updated successfully!");
    //   log("failed to update user");
    //   return res.status(404).json({
    //     success: false,
    //     message: "failed to update contact",
    //   });
    // }


    return res.status(200).json({
      sucess: true,
      message: isDeleted 
        ? "contact deletd successfully"
        : "contact updated successfulyy"
    })

    // console.log("owner------:",req.user);
    // console.log("contact found -----------: ",contact);
    // console.log("your updated contact---------- : ", result);

    //------------------------------------
  } catch (error) {
    console.log("Error updating contact:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating your contact. Please try again later.",
    });
  }
};

// //DELETE findByIdAndDelete ##########################################
// const deleteContact = async (req, res) => {
//   try {

//     const contactId = req.params.id;
    
//     //validation ID
//     if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return res.status(400).json({
//         message: "Invalid contact ID",
//       });
//     }

//     //DB - delete contact🔴
//     const result = await Contact.deleteOne({
//       _id: contactId, //specific contact
//       user: req.user, //specific user
//     });

//     if(result.deletedCount === 0){
//       console.log("contact not found");
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     } else{
//       console.log("contact deleted successfully!");
//       return res.status(200).json({
//         success: true,
//         message: "contact deleted successfully",
//       });
//     }

//     //---------------------------------------------
//   } catch (error) {
//     console.log("Error in deleting contact:",error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deleting your contact. Please try again later.",
//     });
//   }
// };

// // GET : favContacts #############################################
// const favContacts = async (req, res) => {
//   try {

//     //DB - favcontacts 🔴
//     const result = await Contact.find(
//       {
//         user: req.user, //is specific user ka
//         isFavorite: true, // favorite contacts do
//       },
//       { user: 0 },
//     );

//     //if no data
//     if (result.length === 0) {
//       return res.status(200).json({
//         message: "No fav contacts exists",
//         data: [],
//       });
//     }

//     if(result){
// 	  return res.status(200).json({
//       success: true,
//       message: "Favorite contacts fetched successflly",
//       data: result,
//     });
//     }

   
//     //----------------------------------------
//   } catch (error) {
//     console.log("error to fetch FavContacts : ", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching fav Contacts. Please try again later.",
//     });
//   }
// };

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  // deleteContact,
  // favContacts,
};
