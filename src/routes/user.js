const express = require('express');
const auth = require('../middleware/auth');
const { findUserById } = require('../models/user');

const router = express.Router();

// Get current user's profile
router.get('/me', auth, (req, res) => {
  const user = findUserById(req.user.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email });
});

module.exports = router;
