const express = require("express");
const router = express.Router();

const userController = require("../controller/normaluser.controller");

// ✅ Login route
router.post("/login", userController.login);

// ✅ Step 1: Check email and generate reset token
router.post("/check-email", userController.checkEmail);

// ✅ Step 2: Verify reset token
router.post("/check-reset-token", userController.checkResetToken);

// ✅ Step 3: Reset password
router.post("/reset-password", userController.resetPassword);

module.exports = router;
