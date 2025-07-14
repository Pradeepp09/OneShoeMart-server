const User = require('../models/User');
const Store = require('../models/Store');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Token Generators
const generateUserToken = (user) => {
  const token = jwt.sign(
    { _id: user._id, email: user.user_email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log('🔐 JWT Token Generated for user:', token);
  return token;
};

const generateStoreToken = (store) => {
  const token = jwt.sign(
    { _id: store._id, email: store.store_email, role: 'store' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log('🔐 JWT Token Generated for store:', token);
  return token;
};

// 👤 User Registration
exports.registerUser = async (req, res) => {
  const { user_name, user_email, password, user_mobile, user_Address } = req.body;

  try {
    if (await User.findOne({ user_email })) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      user_name,
      user_email,
      password: hashedPassword,
      user_mobile,
      user_Address
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏪 Store Registration
exports.registerStore = async (req, res) => {
  const { store_name, store_email, password, store_mobile, store_Address } = req.body;

  try {
    if (await Store.findOne({ store_email })) {
      return res.status(400).json({ msg: 'Store already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const store = new Store({
      store_name,
      store_email,
      password: hashedPassword,
      store_mobile,
      store_Address
    });

    await store.save();

    res.status(201).json({ msg: 'Store registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 👤 User Login
exports.loginUser = async (req, res) => {
  const { user_email, password } = req.body;

  try {
    const user = await User.findOne({ user_email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateUserToken(user);

    res.status(200).json({
      msg: 'User login successful',
      token,
      user: {
        _id: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
        role: 'user',
        user_mobile: user.user_mobile,
        user_Address: user.user_Address
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏪 Store Login
exports.loginStore = async (req, res) => {
  const { store_email, password } = req.body;

  try {
    const store = await Store.findOne({ store_email });
    if (!store) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateStoreToken(store);

    res.status(200).json({
      msg: 'Store login successful',
      token,
      store: {
        _id: store._id,
        store_name: store.store_name,
        store_email: store.store_email,
        role: 'store',
        store_mobile: store.store_mobile,
        store_Address: store.store_Address
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
