const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },

  // Ordered items (each with shoe ID and quantity)
  items: [
    {
      shoe: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Price at the time of order
    }
  ],

  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },

  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Refunded'],
    default: 'Unpaid'
  },

  deliveryAddress: { type: String, required: true },
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', OrderSchema);
