const mongoose = require("mongoose");
const { Schema } = mongoose;

const attandance = Schema ({
    name:{
        type:String,
        require:false
    },
    registration_id:{
        type:String,
        require:false
        
    },
    marked_user:{
          type: mongoose.Schema.Types.ObjectId,
           ref: "userRegistration",
          required: true,
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model("attandance",attandance);