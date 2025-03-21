const mongoose = require("mongoose");
// not the good way of connecting to the database
// mongoose.connect(
//     "mongodb+srv://smite1834:T3xn0kU3SamSJBvD@namastenodejs.fdygw.mongodb.net/"
// );

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET,
  );
};

module.exports = connectDB;
