const mongoose = require ("mongoose")
const Schema = mongoose.Schema; 

const OrderSchema = new Schema(
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
                ticket_name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                sale_price: {
                    type: Number,
                    required: true,
                },
                currency: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                }, 
            }
        ],
        total_price: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "canceled", "completed"],
            default: "pending",
        },
        payment_method: {
            type: String,
            required: true,
            default:"Razorpay",
        },
        transaction_id: {
            type: String,
            required: false,
        },
        regisstration_id: {
            type: String,
            required: false,
        },
        qr_code: {
            type: String, 
            required: false,
        },
       billingId: {
        type: mongoose.Schema.Types.ObjectId,
       ref: "BillingAddress",
        required: true,
       }
    },
    { timestamps: true }
);

module.exports = mongoose.model('order', OrderSchema);
