const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 📦 Place an order (user only)
router.post('/', protect, authorizeRoles('user'), async (req, res) => {
  try {
    const { store, items, deliveryAddress } = req.body;

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newOrder = new Order({
      user: req.user._id,
      store,
      items,
      totalAmount,
      deliveryAddress
    });

    await newOrder.save();
    res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ msg: 'Error placing order', error: err.message });
  }
});

// 🧾 Get orders for logged-in user (user only)
router.get('/my-orders', protect, authorizeRoles('user'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.shoe store');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user orders' });
  }
});

// 🏪 Get orders for store (store only)
router.get('/store-orders', protect, authorizeRoles('store'), async (req, res) => {
  try {
    const orders = await Order.find({ store: req.user._id }).populate('items.shoe user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching store orders' });
  }
});

module.exports = router;
