const express = require("express");
const userRouter = express.Router();
const {createUser,registerusers,manualCreaateUser} = require("../controllers/registrationController");
const loginRouter = require('../controllers/loginController');



userRouter.post("/user-registration",createUser);
userRouter.post('/role-assignment', manualCreaateUser);
userRouter.post('/login',loginRouter);
userRouter.get('/users', registerusers);




module.exports = userRouter