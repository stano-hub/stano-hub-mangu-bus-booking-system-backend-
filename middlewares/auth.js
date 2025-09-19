const jwt = require("jsonwebtoken");

// Verify token middleware
const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers["authorization"];
      if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }

      // Role-based access
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = auth;
