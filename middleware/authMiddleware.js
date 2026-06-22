const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");

/**
 * @desc   Protect middleware - Decodes token and verifies user exists in database
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header
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
    // 2. Verify the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Inspect the role from token payload and find user in respective collection
    let dbUser = null;
    const userRole = decoded.role || "admin"; // Default fallback to admin if role is missing

    if (userRole === "admin") {
      dbUser = await Admin.findById(decoded.id).select("-password");
    } else if (userRole === "staff") {
      dbUser = await Staff.findById(decoded.id).select("-password");
    }

    // If token passed decryption but user no longer exists in MongoDB
    if (!dbUser) {
      return res.status(401).json({ message: "Token invalid, user account not found" });
    }

    // 4. Attach formatted user object info securely to request pipeline
    req.user = { 
      id: dbUser._id, 
      email: dbUser.email, 
      role: userRole 
    };

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * @desc   Role Authorization middleware - Restricts access to specific roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'staff')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Safety check to ensure protect ran first
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Authorization failed: Role not determined." });
    }

    // Check if user's role is permitted to hit this route
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// Shortcut helper arrays for clean routing configuration files
exports.adminAuth = [exports.protect, exports.authorize("admin")];
exports.staffAuth = [exports.protect, exports.authorize("admin", "staff")];