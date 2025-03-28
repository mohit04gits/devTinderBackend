const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../model/user");

authRouter.post("/signup", async (req, res) => {
  //making signup dynamic
  try {
    validateSignupData(req); // validation

    const { firstName, lastName, emailId, password } = req.body;

    //encrypting password for security purpose
    const passwordHash = await bcrypt.hash(password, 10);
    //console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const existingUser = await User.findOne({ emailId: emailId });
    if (existingUser) {
      return res.status(400).send("Error: Email is already registered");
    }
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("error saving the user" + err.message);
  }
});

//NOTE->just after login a jwt token generarted and added to cookie
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Wrong password");
    }

    const token = await user.getJWT(); // Generates JWT token

    // **Fix: Proper cookie settings**
    res.cookie("token", token, {
      httpOnly: true, // **Prevents client-side access**
      secure: process.env.NODE_ENV === "production", // **Only for HTTPS**
      sameSite: "None", // **For cross-origin requests**
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // **1-day expiry**
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successfull");
});

module.exports = authRouter;
