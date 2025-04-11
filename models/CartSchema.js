const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegistration",
            required: true,
        },
        items: [
            {
                event_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Event",
                    required: true,
                },
                event_name:{
                    type: String,
                    required: true,
                },
         
                ticket_name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                sale_price:{
                    type: Number,
                    required: true,
                },
                currency: {
                    type: String,
                    required: true,
                },
                organser_name:{
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
            }
        ],
        total_price: {
            type: Number,
            required: true,
        },
        totalDiscount :{
            type: Number,
            required: true, 
        },
        currency: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);


