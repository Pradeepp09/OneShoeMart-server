const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const Store = require('../models/Store');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  registerStore,
  loginStore
} = require('../controllers/authController');

// 🔐 Store Registration Endpoint
router.post('/register', registerStore);

// 🔐 Store Login Endpoint
router.post('/login', loginStore);

// 🧾 Get all shoes (public)
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch shoes' });
  }
});

// ➕ Add shoe (store only)
router.post('/', protect, authorizeRoles('store'), async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (err) {
    res.status(400).json({ msg: 'Error adding shoe', error: err.message });
  }
});

// 👤 Get logged-in store info
router.get('/me', protect, authorizeRoles('store'), async (req, res) => {
  try {
    const store = await Store.findById(req.user._id).select('store_name');
    if (!store) return res.status(404).json({ msg: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
