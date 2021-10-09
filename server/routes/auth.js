const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

//@route GET api/auth
//@for check if user login
//@access public
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if(!user) return res.status(400).json({success: false, message: 'User not found'});
    return res.json({success: true, user});

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
})

//@route /api/auth/register
//@for register user
//@access public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }
  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "username is already registered" });
    }

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Return a token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User is created successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

//@route /api/auth/register
//@for register user
//@access public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }
  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "This username is not registered" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(400).json({ success: false, message: "Incorrect username or password" });
 
    }
      
    // All good
    // Return a token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
     res.json({
      success: true,
      message: "User is log in successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

module.exports = router;
