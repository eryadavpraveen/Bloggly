const express = require("express");
const { register,
    login,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    changePassword,
    getLoggedinUserProfile,
    logOut } = require("../../controllers/v1/auth.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { authRateLimiter } = require("../../utils/rate.limiter.helper");
const router = express.Router();

// Strict limit only on sensitive auth actions (not profile / refresh / logout)
router.post("/login", authRateLimiter, login);

router.post("/register", authRateLimiter, register);

router.post("/forgot-password", authRateLimiter, forgotPassword);

router.post("/reset-password", authRateLimiter, resetPassword);

router.post("/change-password", authMiddleware, changePassword);

router.post("/refresh-token", refreshAccessToken);

router.get("/profile", authMiddleware, getLoggedinUserProfile);

router.post("/logout", logOut);



module.exports = router;