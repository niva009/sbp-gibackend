const attandance = require("../models/attaandanceMark");

const addAttandance = async (req, res) => {
  try {
  
    const { userId } = req.user;
    console.log("user ID infoooooo", userId);
    const { name, registration_id} = req.body;

    console.log("reqbody", req.body);

    if (!name || !registration_id ) {
      return res.status(404).json({
        message: "fields are missing",
        success: false,
        error: true,
      });
    }

    const attande = new attandance({
      name,
      registration_id,
      marked_user:userId,
    });

    await attande.save();

    res.status(200).json({
      message: "attendance marked successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "attendance marking error",
      success: false,
      error: true,
    });
  }
};

const markedAttandeList = async (req, res) => {
  try {
    const markedData = await attandance.find().populate('marked_user', 'name');
    console.log("marked user", markedData);

    if (markedData.length > 0) {
      return res.status(200).json({
        message: "attendance list fetched successfully",
        success: true,
        error: false,
        data: markedData, 
      });
    } else {
      return res.status(400).json({
        message: "attendance list is empty",
        success: false,
        error: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "error fetching attendance list",
      success: false,
      error: true,
    });
  }
};

module.exports = { addAttandance, markedAttandeList };
