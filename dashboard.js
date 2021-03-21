const express = require("express");
const router = express.Router();

// Firestore
const Firestore = require("@google-cloud/firestore");
const db = new Firestore();

router.get("login/:id", async (req, res) => {
  const userId = req.params.id;
  if (userId && (await userIdIsPresent(userId)))
    return res.status(200).send("Found");
  else return res.status(404).send("Not Found");
});

router.get("/:id", (req, res) => {
  // Get Avatar, FollowersCount, FollowingCount, PostCount, Points and Rank
  await db.collection('users').doc(req.params.id).doc
});

async function userIdIsPresent(username) {
  let result = false;
  await db
    .collection("users")
    .doc(username)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) result = true;
    });
  return result;
}

module.exports = router;
