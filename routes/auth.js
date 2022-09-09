const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser=require('../middlewares/fetchuser');

//we can add validation like this in an array [] or directly with separating ,(commas) .
//we use package express-validator for validating data

//signature string used in jwt token.
const JWT_SIGNATURE = process.env.JWT_SIGN; //your signature string here

//ROUTE1 creating a user endpoint POST"/api/auth/createuser", no login required
router.post(
  "/createuser",
  [
    body("name", "name should be 5 chars").isLength({ min: 5 }),
    body("email", "enter valid email/unique as well").isEmail(),
    body("password", "password should be 6 chars").isLength({ min: 6 }),
  ],
  async (req, res) => {
    //if there are errors caught in req data validations,return them with bad req.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false, errors: errors.array() });
    }
    try {
      //finding a user of same name and storing in var user if found return error.
      let user = await User.findOne({ email: req.body.email });

      if (user)
        return res.status(400).json({success:false, error: "user already exists with email" });
      
      //else user is not found so create one.
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);
      //create a new user in db
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      //returning object user as payload data with only user id in jwt token.
      const payloadData = {
        user: {
          id: user.id,
        },
      };
      // res.json(user);  //sending the created user object as response.
      
      //creating an authtoken string which is used for verifying user on login required endpoints.
      const authToken = jwt.sign(payloadData, JWT_SIGNATURE);
      res.json({success:true , authToken: authToken });
    } catch (error) {
      
      res.json({500:"Internal server error", message:error.message});
    }
  }
);

//ROUTE2 login user endpoint POST"/api/auth/login", no login required
router.post(
  "/login",
  [
    body("email", "enter a valid email address").isEmail(),
    body("password", "password cannot be empty").exists(), //exists is for checking empty field.
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ success:false,error: "please login with correct credentials" });

      let comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword)
        return res
          .status(400)
          .json({success:false, error: "please login with correct credentials" });
      const payloadData = {
        user: {
          id: user.id,
        },
      };
      // res.json(user);  //
      const authToken = jwt.sign(payloadData, JWT_SIGNATURE);
      res.json({ success:true,authToken :authToken });
    } catch (error) {
      res.json({500:"Internal server error", message:error.message});
    }
  }
);

//ROUTE3 get logged in user details endpoint POST"/api/auth/getuser", 
//Login required(using jwt token to verify the already logged in user is same which is hitting the new/other endpoint.)

//we mostly use this is to verify that the if already logged in user who is making 
//the request (suppose to go on different page) is same or not.
router.post( "/getuser" , fetchuser , async (req, res) => {
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select('-password');
        res.send({ success : true,user : user}); 
    }
    catch (error) {
      res.json({500:"Internal server error", message:error.message});
    }
  }
);

module.exports = router;
