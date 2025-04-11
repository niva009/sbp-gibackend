const userRegistration = require('../models/user_register');
const loginSchema = require('../models/login');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');


const createUser = async (req, res) => {

    try{
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
          }
        const {name, email, phone, password} = req.body;
        console.log("registration data", req.body);
        const hashedPassword = await bcrypt.hash(password, 10);

        const oldEmail = await userRegistration.findOne({email})
        const oldPhone = await userRegistration.findOne({phone});

        if (oldEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }

        if (oldPhone){
            return res.status(400).json({ message: "phonenumber already exist"})
          }
    

        const user = new userRegistration({
            name,
            email,
            phone,
            password: hashedPassword
        })
        user.save()

        const newLogin = new loginSchema({
            email,
            password: hashedPassword,
            user_id: user.id,
            phone,
          });
      
          await newLogin.save();
      
          res.status(201).json({ message: "User registered successfully" });
    }catch(error){
        return res.status(500).json({
            message:"internal serrver error",
            error:error.message,
        })
    }   
   
}

const registerusers = async (req, res) => {

  try {
    const registerDetails = await userRegistration.find({});
    if (!registerDetails) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ message: "User details fetched successfully", data: registerDetails });  
  }
   catch(error) {
  console.error("Error fetching user details:", error);
  res.status(500).json({ message: "Internal server error", error: error.message });
} 
}


module.exports = {createUser,registerusers}


    