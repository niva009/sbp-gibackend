
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
            required: true,
        },
        state: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: true,
        },
        postal_code: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: false,
        }
    })

    module.exports = mongoose.model("BillingAddress", BillingAddressSchema);