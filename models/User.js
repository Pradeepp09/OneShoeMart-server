const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 user_name: { type: String, required: true },
 user_email: {
  type: String,
  required: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  user_mobile: { type: Number, required: true },
  user_Address: { type: String, required: true },
  password: { type: String, required: true },
  cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Shoe'}],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  role: {
  type: String,
  enum: ['user'],
  default: 'user'}

}, {
  timestamps: true
});

module.exports = mongoose.model('User',UserSchema);
