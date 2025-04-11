const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRegistration =  new Schema({
    name: {
        type: String,
    },
    email:{
        type: String,
        required: false,
    },
    phone:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: false,
    },
},{timestamps:true});

module.exports = mongoose.model('userRegistration', userRegistration);