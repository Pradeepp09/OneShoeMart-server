const mongoose = require('mongoose');

const ShoeSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
  type: { type: String }, // e.g., Running, Casual
  colors: { type: String },
  price: { type: Number, required: true },
  shoeImage: { type: String, required: true } // Cloudinary URL
}, {
  timestamps: true
});

module.exports = mongoose.model('Shoe', ShoeSchema);
