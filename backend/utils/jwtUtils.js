const jwt = require('jsonwebtoken');

// Secret key - In production, use environment variable!
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Generate JWT token
 * @param {string} userId - User's MongoDB _id
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },        // Payload - what we store in token
    JWT_SECRET,                // Secret key to sign token
    { expiresIn: '7d' }        // Token expires in 7 days
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token from request
 * @returns {object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;  // Returns: { userId: "...", iat: ..., exp: ... }
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;  // Token invalid or expired
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};
