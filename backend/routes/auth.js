// const express = require("express");
// const jwt = require("jsonwebtoken");

// const router = express.Router();

// // 🔐 LOGIN
// router.post("/login", (req, res) => {
//   const { email, password, role } = req.body;

//   // ⚠️ TEMPORARY (demo login - no DB yet)
//   if (!email || !password || !role) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   const token = jwt.sign(
//     { email, role },
//     process.env.JWT_SECRET || "secret123",
//     { expiresIn: "1d" }
//   );

//   res.json({ token, role });
// });

// // 🔐 SIGNUP (demo)
// router.post("/signup", (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   const token = jwt.sign(
//     { email, role },
//     process.env.JWT_SECRET || "secret123",
//     { expiresIn: "1d" }
//   );

//   res.json({ token, role });
// });

// module.exports = router;


const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// 🔐 SIGNUP (REAL)
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
  router.post("/signup", async (req, res) => {
  console.log("SIGNUP HIT ✅", req.body); // 👈 ADD THIS LINE

  try {
    const { name, email, password, role } = req.body;

    
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// 🔐 LOGIN (REAL)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;