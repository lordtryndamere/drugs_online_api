const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { registervalidation ,loginvalidation} = require("../services/validation");


const AuthController = {
   async login(req,res){
        const item = req.body;
        //Lets validate the data before we a user
        const { error } = loginvalidation(item);
        if (error) return res.status(400).send(error.details[0].message);
    
          //Checking if the  email exists
      const user = await User.findOne({ email: item.email });
      if (!user) return res.status(400).send("Email is not found");
      //Password is correct
    
      const validPass = await bcrypt.compare(item.password,user.password)
      if(!validPass) return res.status(400).send('Invalid password')
    
      //Create and assign a token
    
      const token = jwt.sign({id:user._id,email:user.email},process.env.TOKEN_SECRET);
      res.header('auth-token',token).send({
          user:user,
          token:token
      });
    },
   async register(req,res){
        const item = req.body;
        //Lets validate the data before we a user
        const { error } = registervalidation(item);
        if (error) return res.status(400).send(error.details[0].message);
      
        //Checking if the user is already in the database
        const emailExist = await User.findOne({ email: item.email });
        if (emailExist) return res.status(400).send("Email already exists");
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(item.password, salt);
      
        const user = new User({
          name: item.name,
          email: item.email,
          password: hassPassword,
        });
      
        try {
          const savedUser = await user.save();
          res.send(savedUser);
        } catch (err) {
          res.status(500).send(err);
        }
    }
}

module.exports = AuthController