const jwt=require("jsonwebtoken");

const JWT_SIGNATURE = process.env.JWT_SIGN; //your signature string here
//this is middleware to decode user from jwt
//this req,res and next func's req,res are same 
//because its the same request and we can forward something with responsefrom here as well.
const fetchuser=async(req,res,next)=>{
    const token=req.header('auth-token'); // getting the token string which is passed as 
                                        // header with name auth-token in request.
    if(!token)
    {
        res.status(401).send("Please authenticate using valid token");
    } 
    try {
        //getting user from jwt token and adding it to request as an object.
        const data=jwt.verify(token,JWT_SIGNATURE);
        req.user=data.user;
        next(); // next is the function which will run after this. 
            //it is the original router request function.
    } catch (error) {
        console.log(error.message);
        res.status(401).send("Please authenticate using valid token");
    }
    
}

module.exports=fetchuser;