const Order = require("../models/orderSchema.js");
const Cart = require("../models/orderSchema.js"); // Assuming you have a Cart model
const Razorpay = require("razorpay");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const User = require("../models/user_register.js"); // Assuming email is in User
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


 const CreateOrder = async (req, res) => {
    try {
      const { user_id, billingId } = req.body;

      console.log(req.body);
  
      // Fetch user and cart
   
                const user = await User.findById(user_id);
                if (!user) {
                return res.status(400).json({ success: false, message: "User not found" });
                }

                const cart = await Cart.findOne({ user_id: new ObjectId(user_id) }).populate("items.product");
                if (!cart || cart.items.length === 0) {
                return res.status(400).json({ success: false, message: "Cart is empty or not found" });
                }

                console.log("user info", user);
                console.log("cart info", cart);
  
      // Create order object
      const newOrder = new Order({
        user_id,
        items: cart.items.map(item => ({ ...item._doc })),
        total_price: cart.total_price,
        currency: cart.currency || "INR",
        payment_status: "unpaid",
        order_status: "processing",
        payment_method: "COD",
        billingId,
      });
  
      const savedOrder = await newOrder.save();
  
      // Generate QR code (URL to view order)
      const orderUrl = `https://yourdomain.com/orders/${savedOrder._id}`;
      const qrCode = await QRCode.toDataURL(orderUrl);
  
      // Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Use app password
        },
      });
  
      // Email content
      const emailContent = `
        <h2>Thank you for your order!</h2>
        <p><strong>Order ID:</strong> ${savedOrder._id}</p>
        <p><strong>Total:</strong> ₹${savedOrder.total_price}</p>
        <p>You can track your order using the QR code below:</p>
        <img src="${qrCode}" alt="QR Code" style="width:200px;"/>
        <p>Or click this link: <a href="${orderUrl}">${orderUrl}</a></p>
      `;
  
      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Order Confirmation with QR Code",
        html: emailContent,
      });
  
      // Optional: Clear the cart
    //   await Cart.deleteOne({ user_id });
  
      // Return success response
      res.status(201).json({
        success: true,
        message: "Order created and email sent",
        order: savedOrder,
      });
  
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  };

// exports.createOrderFromCart = async (req, res) => {
//   try {
//     const { user_id, billingId } = req.body;

//     const cart = await Cart.findOne({ user_id }).populate("items.product");
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(cart.total_price * 100),
//       currency: cart.currency,
//       receipt: `receipt_order_${Date.now()}`,
//     });

//     const newOrder = new Order({
//       user_id,
//       items: cart.items.map(item => ({ ...item._doc })),
//       total_price: cart.total_price,
//       currency: cart.currency,
//       payment_status: "pending",
//       order_status: "pending",
//       payment_method: "Razorpay",
//       billingId,
//       transaction_id: razorpayOrder.id,
//     });

//     const savedOrder = await newOrder.save();
//     await Cart.deleteOne({ user_id });

//     res.status(201).json({
//       success: true,
//       message: "Order created",
//       order: savedOrder,
//       razorpayOrder,
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
//   }
// };


// //////raazorpay order verification//////


// exports.verifyAndCapturePayment = async (req, res) => {
//     try {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  
//       // Optional: verify signature here using crypto (for extra security)
  
//       // Update order payment status
//       const order = await Order.findByIdAndUpdate(order_id, {
//         payment_status: "paid",
//         order_status: "confirmed",
//         transaction_id: razorpay_payment_id,
//       }, { new: true }).populate("user_id");
  
//       const orderUrl = `https://yourdomain.com/orders/${order._id}`;
//       const qrCodeData = await QRCode.toDataURL(orderUrl);
  
//       // Send Email with QR Code
//       const transporter = nodemailer.createTransport({
//         service: "gmail", // or Mailgun, etc.
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });
  
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: order.user_id.email,
//         subject: "Your Order is Confirmed!",
//         html: `<h3>Thank you for your order!</h3>
//                <p>Scan this QR to track your order:</p>
//                <img src="${qrCodeData}" alt="QR Code"/>
//                <p><a href="${orderUrl}">${orderUrl}</a></p>`,
//       });
  
//       res.status(200).json({ success: true, message: "Payment verified and email sent" });
//     } catch (error) {
//       console.error("Payment verification error:", error);
//       res.status(500).json({ success: false, message: "Verification failed", error: error.message });
//     }
//   };
  



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
 const verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;

        // Verify payment with Razorpay
        const paymentDetails = await razorpay.payments.fetch(paymentId);

        if (paymentDetails.status !== "captured") {
            return res.status(400).json({ success: false, message: "Payment not captured" });
        }

        // Update order status to paid
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { payment_status: "paid", transaction_id: paymentId },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Payment verified", order: updatedOrder });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
    }
};
 const refundPayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch the order to get payment details
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Initiate refund with Razorpay
        const refund = await razorpay.payments.refund(order.transaction_id, {
            amount: Math.round(order.total_price * 100), // in paisa
            currency: order.currency,
        });

        // Update order status to refunded
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { payment_status: "refunded" },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Payment refunded", order: updatedOrder });
    } catch (error) {
        console.error("Error processing refund:", error);
        res.status(500).json({ success: false, message: "Failed to process refund", error: error.message });
    }
};

 

 

//get full order

 const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user_id", "name email").populate("billingId");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
    }
}

module.exports = { CreateOrder, getOrderById, getOrdersByUserId, updateOrderStatus, verifyPayment, refundPayment, getAllOrders };






