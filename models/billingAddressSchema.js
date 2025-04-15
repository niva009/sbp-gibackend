
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
        phone: {
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

    })

    module.exports = mongoose.model("BillingAddress", BillingAddressSchema);