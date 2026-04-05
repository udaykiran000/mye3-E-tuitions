const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists. Please login again.' });
      }
      
      // Single device login enforcement
      if (req.user.currentDeviceToken && req.user.currentDeviceToken !== decoded.deviceToken) {
        return res.status(401).json({ message: 'Security: Logged in from another device. Please login again.' });
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
