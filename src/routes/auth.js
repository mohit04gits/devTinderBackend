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
    console.log(passwordHash);

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
    //finding user
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordvalid = await user.validatePassword(password);
    if (isPasswordvalid) {
      const token = await user.getJWT(); //get jwt is used for generating token
      console.log("token", token);
      res.cookie("token", token, {
        expiresIn: "1d",
      });
      res.send(user);
    } else {
      throw new Error("wrong password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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
