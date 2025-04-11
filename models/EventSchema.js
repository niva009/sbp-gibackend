const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category_id: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: [String],
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        location: {
            venue_name: { type: String, required: false },
            address: { type: String, required: false },
            city: { type: String, required: false },
            state: { type: String, required: false },
            country: { type: String, required: false },
            postal_code: { type: String, required: false },
            latitude: { type: Number, required: false },
            longitude: { type: Number, required: false },
            is_virtual: { type: Boolean, default: false},
            virtual_link: { type: String, required: false },
        },
        organizer: {
            name: { type: String, required: false },
            email: { type: String, required: false },
            phone: { type: String, required: false },
            website: { type: String, required: false },
            organiser_logo: { type: String, required: false },
            about: { type: String, required: false },
        },
        guests: [
            {
                name: { type: String, required: false },
                image: { type: String, required: false },
            }
        ],
        tickets: 
            {   _id: { type: mongoose.Schema.Types.ObjectId, auto: false }, 
                name: { type: String, required: false },
                price: { type: Number, required: false },
                sale_price: { type: Number, required: false },
                currency: { type: String, required: false },
                quantity: { type: Number, required: false },
                sales_start_date: { type: Date, required: false },
                sales_end_date: { type: Date, required: false },
            },
        event_banner: { type: String, required: false },
        capacity: { type: Number, required: false },
        age_restriction: { type: Number, required: false },
        status: {
            type: String,
            enum: ["draft", "published", "canceled"],
            default: "draft",
        },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
