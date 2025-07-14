const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();

// Import Routes
const shoeRoutes = require('./routes/shoes');
const userAuthRoutes = require('./routes/userAuth');
const storeAuthRoutes = require('./routes/storeAuth');
const orderRoutes = require('./routes/orders');

const authenticateToken = require('./middleware/authenticateToken'); // optional for general protection

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/user', userAuthRoutes);
app.use('/api/store', storeAuthRoutes);
app.use('/api/shoes', shoeRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🛒 Shoe Store API is running');
});

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
