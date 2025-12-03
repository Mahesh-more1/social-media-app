const { verifyToken } = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Invalid token format.",
      });
    }
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Access denied. Invalid or expired token.",
      });
    }

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Access denied. Token verification failed.",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
