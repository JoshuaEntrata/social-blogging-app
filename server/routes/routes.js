const express = require("express");
const router = express.Router();

router.post("/users/login", (req, res) => {
  // Authentication
});

router.post("/users", (req, res) => {
  // Registration
});

router.get("/users", (req, res) => {
  // Get Current User
});

router.post("/users", (req, res) => {
  // Update User
});

router.get("/profiles/:username", (req, res) => {
  // Get Profile
});

router.post("/profiles/:username/follow", (req, res) => {
  // Follow User
});

router.delete("/profiles/:username/follow", (req, res) => {
  // Unfollow User
});

router.get("/articles", (req, res) => {
  // List Articles
});

router.get("/articles/feed", (req, res) => {
  // Feed Articles
});

router.get("/articles/:slug", (req, res) => {
  // Get Article
});

router.post("/articles", (req, res) => {
  // Create Article
});

router.put("/articles/:slug", (req, res) => {
  // Update Article
});

router.delete("/articles/:slug", (req, res) => {
  // Delete Article
});

router.post("/articles/:slug/comments", (req, res) => {
  // Add Comments to an Article
});

router.get("/articles/:slug/comments", (req, res) => {
  // Get Comments from an Article
});

router.delete("/articles/:slug/comments/:id", (req, res) => {
  // Delete Comment
});

router.post("/articles/:slug/favorite", (req, res) => {
  // Favorite Article
});

router.delete("/articles/:slug/favorite", (req, res) => {
  // Unfavorite Article
});

router.get("/tags", (req, res) => {
  // Get Tags
});
module.exports = router;
