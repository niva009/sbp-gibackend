// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET =process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("token..:", token);
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no access token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded userid",decoded );
        req.user = decoded; // Attach decoded token data to the request object
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' , error});
    }
};

module.exports = authenticateToken;