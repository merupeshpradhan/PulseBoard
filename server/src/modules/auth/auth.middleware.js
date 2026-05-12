import ApiError from "../../common/utils/api-error.js";

import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw ApiError.unauthorized("Not authenticated");
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    // Attach user
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export { authenticate };
