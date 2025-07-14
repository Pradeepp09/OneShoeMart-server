const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['https://oneshoemart.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const shoeRoutes = require('./routes/shoes');
const userAuthRoutes = require('./routes/userAuth');
const storeAuthRoutes = require('./routes/storeAuth');
const orderRoutes = require('./routes/orders');

app.use('/api/user', userAuthRoutes);
app.use('/api/store', storeAuthRoutes);
app.use('/api/shoes', shoeRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', time: new Date().toISOString() });
});

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🛒 Shoe Store API is running');
});

// ✅ Static Folder (if needed)
app.use('/uploads', express.static('uploads'));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
