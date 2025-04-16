const Breakfast = require('../models/breakfastSchema');

const addBreakfastRegistration = async (req, res) => {
  try {
    const { name, email, phonenumber, registrationId, legend } = req.body;

    console.log("reqbody breakfast", req.body)

    if (!name || !email || !phonenumber || !registrationId || !legend) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newEntry = new Breakfast({
      name,
      email,
      phonenumber,
      registrationId,
      legend
    });

    await newEntry.save();

    return res.status(201).json({ message: "Registration successful", data: newEntry });
  } catch (error) {
    console.error("Add Registration Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllBreakfastRegistrations = async (req, res) => {
  try {
    const registrations = await Breakfast.find();
    return res.status(200).json({ data: registrations });
  } catch (error) {
    console.error("Get Registrations Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addBreakfastRegistration,
  getAllBreakfastRegistrations
};
