const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendServerError } = require('../../utils/http');

class AuthService {
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async register(userData) {
    try {
      const { name, email, mobile, password, role } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }]
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email or mobile already exists'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create new user
      const user = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        role,
        status: role === 'admin' ? 'approved' : 'pending',
        verified: role === 'admin'
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          status: user.status,
          verified: user.verified
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return sendServerError(null, error);
    }
  }

  async login(identifier, password) {
    try {
      // Find user by email or mobile
      const user = await User.findOne({
        $or: [{ email: identifier }, { mobile: identifier }]
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Check password
      const isPasswordValid = await this.comparePassword(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Generate token
      const token = this.generateToken(user._id);

      // Update last login
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date()
      });

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          status: user.status,
          verified: user.verified
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return sendServerError(null, error);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, message: 'Invalid token' };
    }
  }
}

module.exports = new AuthService();
