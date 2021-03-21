const express = require("express");
const router = express.Router();

// Firestore
const Firestore = require("@google-cloud/firestore");
const db = new Firestore();

router.get("/", (req, res) => {
  // Get the ranking of top 10 users
});

module.exports = router;
