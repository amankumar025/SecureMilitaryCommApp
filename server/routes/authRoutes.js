const express = require('express');
const router = express.Router();
const { signupuser, loginuser } = require('../controllers/authController'); 


const User = require('../models/User');
const authenticateUser = require('../middleware/authMiddleware');
/// Get all users except self
router.get('/users', authenticateUser, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select('username _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users' });
  }
});


//const { signupuser, loginuser } = require('../controllers/authController'); // error solved
router.post('/signup', signupuser);
router.post('/login', loginuser);

module.exports = router;