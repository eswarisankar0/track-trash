exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

exports.isCollector = (req, res, next) => {
  if (req.user.role !== "collector") {
    return res.status(403).json({ message: "Collector access only" });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};
