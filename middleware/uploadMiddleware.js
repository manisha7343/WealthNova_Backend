// middleware/uploadMiddleware.js
const multer = require('multer');
const storage = require('../config/multerConfig'); //  Config se storage setting li

// Multer ko setting ke sath taiyar kiya
const upload = multer({ storage: storage });

 
// -------------- option 1 ---------------------
// Frontend se 'profilePic' ke naam se aane wali ek single photo ko handle karne ka middleware
//its a middlware this internally return runs a middlware


const uploadProfilePicMiddleware = upload.single('profilePic');

//---------------- option 2 ------------------------------
// Direct Multer function call (Jisme req, res, next dikhta hai)

// const uploadProfilePicMiddleware = (req, res, next) => {
//     upload.single('profilePic')(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ message: "File upload error" });
//         }
//         next(); // Agle controller par bhejo
//     });
// };

//--------------------------------------------------
// Isko export kar diya taaki routes me use ho sake
module.exports = uploadProfilePicMiddleware;