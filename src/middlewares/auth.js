const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(402).send("pls login")
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

//exporting
module.exports = {
  userAuth,
};
