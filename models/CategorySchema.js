const mongoose = require("mongoose");
const { Schema } = mongoose;

const category = Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
        sparse:true,
    },
    metatitle:{
        type:String,
        require:true,
    },
    metadescription:{
        type:String,
        require:true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model("Category",category);