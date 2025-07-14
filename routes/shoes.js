const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const Shoe = require('../models/Shoe');

router.post('/', upload.single('shoeImage'), async (req, res) => {
  try {
    const { brand, model, gender, type, colors, price, weight } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Image is required' });

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'shoes' },
      async (error, result) => {
        if (error) return res.status(500).json({ error: 'Upload failed' });

        // Save shoe data in MongoDB
        const newShoe = new Shoe({
          brand,
          model,
          gender,
          type,
          colors,
          price,
          weight,
          shoeImage: result.secure_url
        });

        await newShoe.save();
        res.status(201).json({ message: 'Shoe added', shoe: newShoe });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/shoes
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find().sort({ createdAt: -1 });
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
