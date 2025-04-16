const mongoose = require('mongoose');
const { Schema } = mongoose;



const facultySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true, 
    }

}, { timestamps: true });   


module.exports = mongoose.model("faculity",facultySchema);