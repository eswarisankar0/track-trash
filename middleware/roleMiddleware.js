// Generic role checker function
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // If token not verified or user missing
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Token missing or invalid."
      });
    }

    // If role does not match
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `${requiredRole} access only`
      });
    }

    // Role valid → continue
    next();
  };
};

// Export specific role middlewares
exports.isAdmin = checkRole("admin");
exports.isCollector = checkRole("collector");
exports.isUser = checkRole("user");