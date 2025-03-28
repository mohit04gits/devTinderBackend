const express = require("express");
const app = express();
const cors = require("cors")
const User = require("./model/user")
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const sendConnectionRequest = require("./routes/requests");
const requestRouter = require("./routes/requests");
const { userAuth } = require("./middlewares/auth");
const userRouter = require("./routes/user");

require("dotenv").config();
// const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devtinderfrontend.onrender.com"], // Allow both local and deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Must be placed correctly (not inside 'origin' array)
  })
);







app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);


//feed
app.get("/feed",userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("something went wrong");
    console.log(err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) {
    {
      res.status(404).send("something went wrong");
    }
  }
});



//update
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = ["skills", "about", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      Allowed_Updates.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for one or more fields");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      //new: true, // Return the updated document
      returnDocument: "after",
      runValidators: true, // Ensure validation rules are applied
    });

    // if (!user) {
    //   return res.status(404).send("User not found");
    // }

    // res.status(200).send({ message: "User updated successfully", user });
    res.send(user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

//PROFILE

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT || 3000, () => {
      console.log("server started on server 3000");
    });
  })

  .catch((err) => {
    console.log("Database not connected");
  });
