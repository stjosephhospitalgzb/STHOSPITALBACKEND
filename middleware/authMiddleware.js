const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only check Admin – no student lookup
    const user = await Admin.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token invalid, user not found" });
    }

    req.user = { id: user._id, email: user.email, role: "admin" };
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Authorize middleware (now expects only 'admin')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Authorization failed: Role not determined." });
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: User role ${userRole} is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// If you had studentAuth, remove it or keep as admin-only
exports.adminAuth = [exports.protect, exports.authorize("admin")];