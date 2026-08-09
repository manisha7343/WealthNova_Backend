//middleware auth
const jwt = require("jsonwebtoken");
const { log } = require("node:console");

const auth = (req, res, next) => {

    //1.header/authoorization se token lo 
    const authHeader = req.headers.accesstoken || req.headers.authorization;

    //2.check kro token hai ya nhi 
    if(!authHeader){
        return res.status(401).json({msg: "No token. access denied"})     
    }

    //3.token extract (removed the Beare word and get teh token (0 = bearer 1 = token)) 
    const token = authHeader.split(" ")[1];
    try{

            //verify token
            const decoded = jwt.verify(token, process.env.KEY);
        
            // user req = token me se id jayegi
            req.user = decoded.userId;  //🔴 study 
            console.log("req user ------------------------------ ",req.user );
            
            
            // next route run hone do
            next();


    }
    catch(error){
        res.status(401).json({msg:" invalid token"})
    }

}

module.exports = auth;

