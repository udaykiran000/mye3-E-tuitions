const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');

const generateToken = (res, userId, deviceToken) => {
  const token = jwt.sign({ userId, deviceToken }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        const deviceToken = crypto.randomBytes(16).toString('hex');
        user.currentDeviceToken = deviceToken;
        await user.save();

        generateToken(res, user._id, deviceToken);

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    }
    
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'Student',
    });

    if (user) {
      const deviceToken = crypto.randomBytes(16).toString('hex');
      user.currentDeviceToken = deviceToken;
      await user.save();

      generateToken(res, user._id, deviceToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    
    if (req.user) {
        req.user.currentDeviceToken = null;
        await req.user.save();
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser, registerUser, logoutUser };
