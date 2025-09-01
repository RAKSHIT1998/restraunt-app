const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/user');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = createUser(email, hashed);
  res.status(201).json({ id: user.id, email: user.email });
});

// Login and issue JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  res.json({ token });
});

module.exports = router;
