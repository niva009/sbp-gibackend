
const faculity = require("../models/facultySchema");




const addFaculity = async (req, res) => {
    try {
        const { name, image, type } = req.body;
        const newFaculity = new faculity({ name, image, type });
        await newFaculity.save();
        res.status(200).json({ message: "Faculty added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getFaculity = async (req, res) => {
    try {
        const faculities = await faculity.find();
        res.status(200).json(faculities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addFaculity,
    getFaculity
}




