const userRegistration = require('../models/user_register');
const loginSchema = require('../models/login');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');

const crypto = require("crypto"); 
const createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, email, phone } = req.body;

    console.log("registration data", req.body);


    const rawPassword = crypto.randomBytes(5).toString("hex"); 
    const hashedPassword = await bcrypt.hash(rawPassword, 10);


    const oldEmail = await userRegistration.findOne({ email });
    const oldPhone = await userRegistration.findOne({ phone });


    console.log("oldphone,emaail", oldEmail, oldPhone);

    if (oldEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (oldPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const user = new userRegistration({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    const newLogin = new loginSchema({
      email,
      password: hashedPassword,
      user_id: user.id,
      phone,
    });

    await newLogin.save();

    res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: rawPassword, 
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


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


    