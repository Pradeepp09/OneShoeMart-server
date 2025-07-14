const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🛡️ CORS: Allow Vercel frontend and local development
const allowedOrigins = [
  'http://localhost:3000',
  'https://oneshoemart-git-main-pradeep-paraskars-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 📦 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data if needed

// 🧩 Routes
const shoeRoutes = require('./routes/shoes');
const userAuthRoutes = require('./routes/userAuth');
const storeAuthRoutes = require('./routes/storeAuth');
const orderRoutes = require('./routes/orders');

// Use Routes
app.use('/api/user', userAuthRoutes);
app.use('/api/store', storeAuthRoutes);
app.use('/api/shoes', shoeRoutes);
app.use('/api/orders', orderRoutes);

// 🌐 Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', time: new Date().toISOString() });
});

// 🧪 Root
app.get('/', (req, res) => {
  res.send('🛒 Shoe Store API is running');
});

// 🗂️ Serve static files (optional)
app.use('/uploads', express.static('uploads')); // for image storage if needed

// 🧵 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🛠️ Optional: Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
