import User from "./auth.model.js";

import ApiError from "../../common/utils/api-error.js";

import { generateAccessToken } from "../../common/utils/jwt.utils.js";

// Register user
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing) {
    throw ApiError.conflict("Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

// Login user
const login = async ({ email, password }) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    id: user._id,
  });

  return {
    user,
    accessToken,
  };
};

// Current user
const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

// Logout user
const logout = async () => {
  return true;
};

export { register, login, getMe, logout };
