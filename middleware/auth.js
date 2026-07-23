//middleware auth
const jwt = require("jsonwebtoken")

const auth = (req, res, next) =>{

    //1.header se token lo 
    const authHeader = req.headers.accesstoken || req.headers.authorization;

    //2.check kro token hai ya nhi 
    if(!authHeader){
        return res.status(401).json({msg: "access denied. No token"})     
    }

    //3.token extract (removed the Beare word) 
    const token = authHeader.split(" ")[1];
    try{

            //verify token
            const decoded = jwt.verify(token, process.env.KEY);
        
            // user req = token me se id jayegi
            req.user = decoded.userId; 
            
            // next route run hone do
            next();


    }
    catch(error){
        res.status(401).json({msg:" invalid token"})
    }

}

module.exports = auth;

