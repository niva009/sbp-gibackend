const Order = require("../models/orderSchema.js");
const Cart = require("../models/orderSchema.js"); // Assuming you have a Cart model
const Razorpay = require("razorpay");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const User = require("../models/user_register.js"); // Assuming email is in User
const Billing = require("../models/billingAddressSchema.js"); // Assuming you have a Billing model
const Event = require("../models/eventSchema.js"); // Assuming you have an Event model
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const crypto = require("crypto");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


const generateRegistrationId = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit number
  return `HPB-${randomDigits}`;
};

// e.g., HPB-4837



const CreateOrder = async (req, res) => {
  try {
    const { user_id, billingId, event_id, quantity } = req.body;


    console.log("Incoming Request:", req.body);

    const user = await User.findById(user_id);
    const billing = await Billing.findById(billingId);
    const event = await Event.findById(event_id);

    console.log("User:", event);

    if (!user || !billing || !event) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const total_price = event?.tickets?.sale_price * quantity;

    console.log("Total Price:", total_price); 
    const currency = event.currency || "INR";

    // 1. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: total_price * 100, // in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    });


    console.log("Razorpay Order generated:", razorpayOrder);

    // 2. Create DB Order
    const order = new Order({
      user_id,
      items: [
        {
          event_id: event._id,
          ticket_name: event?.tickets?.name,
          price:event?.tickets?.price,
          sale_price: event?.tickets?.sale_price,
          currency,
          quantity,
        },
      ],
      total_price,
      currency,
      payment_status: "pending",
      order_status: "pending",
      payment_method: "Razorpay",
      billingId,
      transaction_id: razorpayOrder.id,
    });

    const savedOrder = await order.save();
    savedOrder.registration_id = generateRegistrationId();
await savedOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: savedOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Signature verification (Very Important)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update order in DB
    const updatedOrder = await Order.findOneAndUpdate(
      { transaction_id: razorpay_order_id },
      {
        payment_status: "paid",
        order_status: "confirmed",
        transaction_id: razorpay_payment_id,
      },
      { new: true }
    ).populate("user_id");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Generate QR code
    const orderUrl = `https://spbgi-admin.vercel.app/orders/${updatedOrder._id}`;
    const qrBuffer = await QRCode.toBuffer(orderUrl);

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2c3e50;">Registration Confirmation – HPB & GI Cancer Summit 2025</h2>
      <p>Dear ${updatedOrder.user_id.name},</p>
      <p>Thank you for registering for the <strong>HPB & GI Cancer Summit 2025</strong>, an initiative by the <strong>Senadhipan Education Foundation</strong>. We are delighted to welcome you to this prestigious gathering of surgical professionals and experts.</p>
  
      <h3 style="color: #2c3e50;">📍 Event Details</h3>
      <p><strong>Event:</strong> HPB & GI Cancer Surgery Summit 2025</p>
      <p><strong>Venue:</strong> Uday Samudra Leisure Beach Hotel, Kovalam, Thiruvananthapuram</p>
      <p><strong>Dates:</strong> 10th & 11th May 2025</p>
  
      <p>Please retain this email as confirmation of your registration.</p>
  
      <p><strong>Registration ID:</strong>${updatedOrder.registration_id}}</p>
  
      <h3 style="color: #2c3e50;">🔗 Quick Access</h3>
      <p>You may scan the attached QR code to view your program and updates anytime.</p>
  
      <p>If you have any questions or need further assistance, feel free to contact us at <strong>98475 72355</strong>.</p>
      
      <p>For more details about the event, please visit our <a href="https://hpbgicancersurgerysummit2025.com" style="color: #2980b9;">official website</a>.</p>
  
      <p>We look forward to meeting you at the summit and sharing an enriching experience together!</p>
  
      <p style="margin-top: 30px;">
        Warm regards,<br>
        <strong>Team – HPB & GI Cancer Surgery Summit 2025</strong><br>
        Senadhipan Education Foundation
      </p>
    </div>
  `;
  

    await transporter.sendMail({
      from: `"HPB & GI Cancer Summit" <${process.env.EMAIL_USER}>`,
      to: updatedOrder.user_id.email,
      subject: "Registration Confirmed – HPB & GI Cancer Summit",
      html: emailHtml,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          cid: 'qrCodeImage',
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and email sent",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};





const getOrderById = async (req, res) => {
  try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate("user_id", "name email").populate("billingId");

      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.status(200).json({ success: true, order });
  } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
      const { user_id } = req.params;

      const orders = await Order.find({ user_id }).populate("user_id", "name email").populate("billingId");

      if (!orders || orders.length === 0) {
          return res.status(404).json({ success: false, message: "No orders found" });
      }

      res.status(200).json({ success: true, orders });
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
      const { orderId } = req.params;
      const { order_status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { order_status },
          { new: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};  


//get full order

 const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user_id", "name email").populate("billingId").populate("user_id");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
    }
}



const generateUniqueRegistrationId = async () => {
  const prefix = "HPB-GI";
  let isUnique = false;
  let regId = "";

  while (!isUnique) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    regId = `${prefix}-${randomNumber}`;

    const existingOrder = await Order.findOne({ regisstration_id: regId });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return regId;
};



const ManualCreateOrder = async (req, res) => {
    try {
      const { user_id, billingId, total_price = 6000, currency = "INR", transaction_id } = req.body;
  
      console.log("Incoming Request:", req.body);
  
      // Validate user
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      // Validate billing
      const billing = await Billing.findById(billingId);
      if (!billing) {
        return res.status(400).json({ success: false, message: "Billing address not found" });
      }

      const registration_id = await generateUniqueRegistrationId();

  
      // Sample item
      const items = [
        {
          event_id: "67fbefdb9296a435619adf98",
          ticket_name: "Delegate Pass",
          price: 10000,
          sale_price: 6000,
          currency: "INR",
          quantity: 1,
          organser_name: "Senadhipan Institute of Medical Sciences",
          subtotal: 6000,
        }
      ];
  
      // Create order
      const newOrder = new Order({
        user_id,
        billingId,
        items,
        total_price,
        currency,
        payment_status: "paid",
        order_status: "confirmed",
        payment_method: "Manual",
        transaction_id,
        regisstration_id: registration_id,
      });
  
      const savedOrder = await newOrder.save();
  
      // Generate QR code buffer
      const orderUrl = `https://spbgi-admin.vercel.app/orders/${savedOrder._id}`;
      const qrBuffer = await QRCode.toBuffer(orderUrl);
  
      // Send email with QR code attachment
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2c3e50;">Registration Confirmation – HPB & GI Cancer Summit 2025</h2>
        <p>Dear  ${user.name},</p>
        <p>Thank you for registering for the <strong>HPB & GI Cancer Summit 2025</strong>, an initiative by the <strong>Senadhipan Education Foundation</strong>. We are delighted to welcome you to this prestigious gathering of surgical professionals and experts.</p>
    
        <h3 style="color: #2c3e50;">📍 Event Details</h3>
        <p><strong>Event:</strong> HPB & GI Cancer Surgery Summit 2025</p>
        <p><strong>Venue:</strong> Uday Samudra Leisure Beach Hotel, Kovalam, Thiruvananthapuram</p>
        <p><strong>Dates:</strong> 10th & 11th May 2025</p>
    
        <p>Please retain this email as confirmation of your registration.</p>
    
        <p><strong>Registration ID:</strong>${savedOrder.regisstration_id}</p>
    
        <h3 style="color: #2c3e50;">🔗 Quick Access</h3>
        <p>You may scan the attached QR code to view your program and updates anytime.</p>
    
        <p>If you have any questions or need further assistance, feel free to contact us at <strong>98475 72355</strong>.</p>
        
        <p>For more details about the event, please visit our <a href="https://hpbgicancersurgerysummit2025.com" style="color: #2980b9;">official website</a>.</p>
    
        <p>We look forward to meeting you at the summit and sharing an enriching experience together!</p>
    
        <p style="margin-top: 30px;">
          Warm regards,<br>
          <strong>Team – HPB & GI Cancer Surgery Summit 2025</strong><br>
          Senadhipan Education Foundation
        </p>
      </div>
    `;
  
    await transporter.sendMail({
      from: `"HPB & GI Cancer Summit 2025" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Order Confirmation with QR Code",
      html: emailHtml,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          cid: 'qrCodeImage',
        },
      ],
    });
    
  
      res.status(201).json({
        success: true,
        message: "Order created and email sent with QR code",
        order: savedOrder,
      });
  
    } catch (err) {
      console.error("Manual Order Error:", err);
      res.status(500).json({ success: false, message: "Internal Error", error: err.message });
    }
  };

module.exports = { CreateOrder, getOrderById, getOrdersByUserId, updateOrderStatus, verifyPayment, getAllOrders,ManualCreateOrder };






