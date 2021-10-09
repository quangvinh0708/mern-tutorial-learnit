const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

// Route get api/posts
// get posts
/// access private
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

// Route POST api/posts
// create posts
/// access private
router.post("/", verifyToken, async (req, res) => {
  const { title, description, status, url } = req.body;

  // Simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  try {
    const newPost = new Post({
      title,
      description,
      status: status || "TO LEARN",
      url: url.startsWith("https://") ? url : `https://${url}`,
      user: req.userId,
    });

    await newPost.save();
    res.json({ success: true, message: `Happy Learning!`, post: newPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

// Route PUT api/posts
// update posts
/// access private
router.put("/:id", verifyToken, async (req, res, next) => {
  const { title, description, url, status } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  try {
    let updatedPost = {
      title,
      description: description || "",
      // Old Login Code
      // url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      // New Logic Code
      url: url ? (url.startsWith("https://") ? url : `https://${url}`) : "",
      status: status || "TO LEARN",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );
    // Or more detail information
    // updatedPost = await Post.findOneAndUpdate(
    //   postUpdateCondition,
    //   updatedPost,
    //   { new: true }
    // ).populate('user', ["username"]);

    // User not authorized to update post or post not found
    if (!updatedPost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized ",
      });
    }

    res.json({
      success: true,
      message: "Excellent progess!",
      post: updatedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

// Route delete api/posts
// delete posts
/// access private
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(
      postDeleteCondition
    ).populate("user", ["username"]);

    // User not authorized or post not found
    if (!deletedPost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized ",
      });
    }

    res.json({ success: true, post: deletedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
    next(err);
  }
});

module.exports = router;
