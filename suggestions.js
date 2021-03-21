const express = require('express');
const router = express.Router();

// Firestore
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();

router.get('/:id', (req, res) => {
  // Returns the user's suggestions and recommendations
});

module.exports = router;
