import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

import User from "./auth.model.js";

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token continue normally
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Find user
    const user = await User.findById(decoded.id);

    // Attach user if exists
    if (user) {
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
    }

    next();
  } catch (error) {
    next();
  }
};

export default optionalAuth;
