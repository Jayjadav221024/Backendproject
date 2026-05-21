const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

// console.log("Connecting to:", process.env.MONGODB_URI); // 👈 temporary debug

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // console.log("MongoDB connected ✅"); // 👈 visible in Render logs
    dbgr("connected");
  })
  .catch((err) => {
    // console.error("MongoDB connection error ❌", err.message); // 👈 visible in Render logs
    dbgr(err);
  });

module.exports = mongoose.connection;