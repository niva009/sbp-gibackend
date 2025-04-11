const BillingAddress = require("../models/billingAddressSchema");

// Create a new billing address
exports.createBillingAddress = async (req, res) => {
    try {
        
        const { userId } = req.user;

        console.info("User ID from token:", userId); // Log the userId for debugging
        const existingAddress = await BillingAddress.findOne({ user_id: userId });
        if (existingAddress) {  
            return res.status(400).json({ success: false, message: "Billing address already exists" });
        }
        // Create a new billing address 
        req.body.user_id = userId; // Add userId to the request body
        const { name, email, phone, address, city, state, zip } = req.body;  
        const newAddress = new BillingAddress(req.body);
        const savedAddress = await newAddress.save();
        res.status(201).json({ success: true, message: "Billing address created", data: savedAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating billing address", error: error.message });
    }
};

// Update a billing address
exports.updateBillingAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAddress = await BillingAddress.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: "Billing address not found" });
        }

        res.status(200).json({ success: true, message: "Billing address updated", data: updatedAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating billing address", error: error.message });
    }
};

// Delete a billing address
exports.deleteBillingAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAddress = await BillingAddress.findByIdAndDelete(id);

        if (!deletedAddress) {
            return res.status(404).json({ success: false, message: "Billing address not found" });
        }

        res.status(200).json({ success: true, message: "Billing address deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting billing address", error: error.message });
    }
};
