const User = require("../model/users");
const admin = require("../firebaseAdmin");

// Signup Route
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res
        .status(409)
        .json({ status: false, message: "User already exists" });
    }

    // Optionally, you can create a Firebase user here if you want Firebase to handle the signup
    const newUser = await User.create({
      name,
      email,
      password,
      provider: "vin-app",
    });

    // Respond without the password field
    res.status(201).json({
      status: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Login Route with Firebase token verification
const login = async (req, res) => {
  try {
    const { email, password, idToken } = req.body;

    // Verify Firebase ID Token if provided
    let firebaseUser;
    if (idToken) {
      firebaseUser = await admin.auth().verifyIdToken(idToken);
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // If logging in with email/password, check the password
    if (!idToken && user.password !== password) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid password" });
    }

    // If logging in with Firebase, match the Firebase user email with the DB email
    if (idToken && firebaseUser.email !== email) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Firebase user" });
    }

    // Respond with a success message
    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const socialLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ status: false, message: "ID token is required" });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { email, name } = decodedToken;

    // Check if the user already exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if one doesn't exist
      user = await User.create({ name, email, provider: "firebase" });
    }

    // Respond with user information
    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during social login:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports = { signup, login, socialLogin };
