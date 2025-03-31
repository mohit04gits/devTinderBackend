

const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();
const http = require("http");

const User = require("./model/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");

require("dotenv").config();

const server = http.createServer(app);
initializeSocket(server); //calling with server

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // Must be placed correctly (not inside 'origin' array)
  })
);

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Feed Route
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log(err);
  }
});

// Delete User
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Update User
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
      returnDocument: "after",
      runValidators: true,
    });

    res.send(user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

// Connect to Database and Start Server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });
