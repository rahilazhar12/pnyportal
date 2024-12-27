const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Sign in First to proceed further" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user info to the request object
    next(); // Move to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAuthedit = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must sign in first to Edit Information" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user info to the request object
    next(); // Move to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authenticateToken = (req, res, next) => {
  // Token is usually sent in the authorization header
  const authHeader = req.headers["authorization"];
  // Authorization header value is typically "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // If there's no token, not authorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token is no longer valid

    // Assuming the JWT contains the entire user object, you can adjust as needed
    req.user = user;
    next(); // Proceed to the next middleware or the route handler
  });
};

module.exports = { requireAuth, requireAuthedit, authenticateToken };
