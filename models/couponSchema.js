const mongoose = require("mongoose");
const Schema = mongoose.Schema


const couponSchema = new Schema({

    couponCode:{
        type: String,
        required: true,
    },
    discountType:{
        type:{
        type: String,
        required: true,
        enum:['fixed', 'percentage']
     },
     value:{
            type: Number,
            required: true,
     }
},description:{
    type: String,
    required: false
},
event_id:{
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
},
isActive:{
    type: Boolean,
    required: false,
    default: true,
},
couponNumbers:{
    type: Number,
    required: false,
},
cartAmount:{
    type: Number,
    required:false,
},

})
module.exports = mongoose.model('couponcode', couponSchema);