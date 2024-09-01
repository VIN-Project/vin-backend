const mongoose = require("mongoose");

// Define a simple schema and model for demonstration
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    provider: { type: String },
    password: { type: String },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);

module.exports = User;
