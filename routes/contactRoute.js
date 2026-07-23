const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")// middleware
const { createContactValidation, updateContactValidation } = require('../validators/contactValidator');

const {
    createContact,
    getContacts,
    updateContact,
    getContactById,
    // deleteContact,
    // favContacts
} = require("../controllers/contactController");



//POST : createConatct
router.post("/", auth, createContactValidation, createContact);

// //GET : find - favContacts
// router.get("/favorites", auth, favContacts);

//GET : getContacts
router.get("/", auth, getContacts);

//GET : getContactsById
router.get("/:id", auth, getContactById);//single con

//PUT : findByIdAndUpadte
router.put("/:id", auth, updateContactValidation, updateContact);

// //DELETE : findByIdAndDelete
// router.delete("/:id", auth, deleteContact);




module.exports = router;
