import * as authService from "./auth.service.js";

import ApiResponse from "../../common/utils/api-response.js";

// Register
const register = async (req, res) => {
  const user = await authService.register(req.body);

  ApiResponse.created(res, "Registration successful", user);
};

// Login
const login = async (req, res) => {
  const { user, accessToken } = await authService.login(req.body);

  ApiResponse.ok(res, "Login successful", {
    user,
    accessToken,
  });
};

// Current user
const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);

  ApiResponse.ok(res, "User profile", user);
};

// Logout
const logout = async (req, res) => {
  await authService.logout();

  ApiResponse.ok(res, "Logout successful");
};

export { register, login, getMe, logout };
