const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    console.log("Cookies received on backend:", req.cookies); // ✅ Debugging
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ message: "No token found, please log in" });
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded JWT:", decodedObj); // ✅ Debugging

    const user = await User.findById(decodedObj._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Authentication failed: " + err.message });
  }
};

// Exporting
module.exports = { userAuth };
