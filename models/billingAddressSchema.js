
const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const BillingAddressSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegistration",
            required: true,
        },
        age:{
            type: String,
            required:false,
        },
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        postal_code: {
            type: String,
            required: false,
        },
        position:{
            type:String,
            required:false
        },
        instution:{
            type:String,
            required:false,
        },
        sex:{
            type:String,
            required: false,
        },
        member:{
            type: String,
            required:false,
        },
        invitation:{
            type:String,
            required:false
        },

    })

    module.exports = mongoose.model("BillingAddress", BillingAddressSchema);