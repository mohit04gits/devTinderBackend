const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // ✅ Debugging: Check if token is received
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Please log in" }); // ✅ Change 402 → 401
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ No need for await
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message); // ✅ Log error for debugging
    res.status(401).json({ message: "Authentication failed: " + err.message }); // ✅ Return 401 instead of 400
  }
};

// Exporting
module.exports = { userAuth };
