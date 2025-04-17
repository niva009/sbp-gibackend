const BillingAddress = require("../models/billingAddressSchema");

// Create a new billing address
exports.createBillingAddress = async (req, res) => {
    try {
      const { name, email, address, city, state, position, institution, user_id,sex,member,invitation,age } = req.body;


      console.log("req.body", req.body); // Log the request body for debugging
  
      console.log("Billing address data:", req.body); // Logs all fields including user_id
  
      const newAddress = new BillingAddress(req.body);
      const savedAddress = await newAddress.save();
  
      res.status(201).json({ success: true, message: "Billing address created", data: savedAddress });
  
      console.log("Billing address created:", savedAddress);
    } catch (error) {
      console.error("Error creating billing address:", error);
      res.status(500).json({ success: false, message: "Error creating billing address", error: error.message });
    }
  };
  



exports.createManualBillingAddress = async (req, res) => {
    try {
        const { user_id, name, address, state,position,instution,sex,member,invitation } = req.body;

        console.log("Billing address data:", req.body); // Log the request body for debugging

        if (!user_id) {
            return res.status(400).json({ success: false, message: "user_id is required in the request body" });
        }

        console.info("User ID from body:", user_id);

        const existingAddress = await BillingAddress.findOne({ user_id });
        console.log("Existing address:", existingAddress); // Log the existing address for debugging
        if (existingAddress) {
            return res.status(400).json({ success: false, message: "Billing address already exists" });
        }

        const newAddress = new BillingAddress({
            user_id,
            name,
            address,
            state,
            position,
            instution,
            sex,
            member,
            invitation
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            message: "Billing address created",
            billing: savedAddress
        });

        console.log("Billing address created:", savedAddress);

    } catch (error) {
        console.error("Error creating billing address:", error);
        res.status(500).json({
            success: false,
            message: "Error creating billing address",
            error: error.message
        });
    }
};


// Update a billing address
exports.updateBillingAddress = async (req, res) => {
    try {
        const userId = req.body.user_id;
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
