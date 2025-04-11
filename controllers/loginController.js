const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const LoginSchema = require("../models/login");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { phone, email, password } = req.body;

    try {
        if (!email && !phone) {
            return res.status(400).json({ message: "Email or phone is required", success: false, error: true });
        }

        const user = await LoginSchema.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist", success: false, error: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password", success: false, error: true });
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.status(200).json({ message: "Login successful", token: token, success: true, error: false });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = login;
