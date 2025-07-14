const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  store_name: { type: String, required: true },
  store_email: {
  type: String,
  required: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  store_mobile: { type: Number, required: true },
  store_Address: { type: String, required: true },
  password: { type: String, required: true },
  shoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shoe' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  role: {
  type: String,
  enum: ['store'],
  default: 'store'}
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', StoreSchema);
