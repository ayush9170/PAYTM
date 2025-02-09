const jwt =  require("jsonwebtoken");

const JWT_SECRET= "123@WBNITDGP";


 function user_Middle(req,res,next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try{
       const decode =  jwt.verify(token,JWT_SECRET);

       if(decode){
        req.userId = decode.userId;
       }
       next();
    }catch(e){
res.json({
    message : "error accured in middleware"
})
    }
}

module.exports={
    user_Middle
}



