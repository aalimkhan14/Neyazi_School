const { Op } = require("sequelize");
const user_model = require("../models/user.model");
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username and password (plain text)
    const user = await user_model.findOne({
      where: { username, password },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        role: user.role
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Step 1: Check email and generate reset token
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await user_model.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Save to DB
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // ✅ Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can use "hotmail", "yahoo", etc.
      auth: {
        user: process.env.EMAIL_USER, // your sender email
        pass: process.env.EMAIL_PASS, // your app password (not your Gmail login)
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: `"Your App Support" <applicationtests25@gmail.com>`,
      to: email,
      subject: "رمز بازنشانی رمز عبور شما",
      text: `کد بازنشانی رمز شما: ${resetToken}\nاین کد تا ۱۰ دقیقه معتبر است.`,
      html: `
        <div style="font-family: sans-serif; direction: rtl; text-align: right;">
          <h2>درخواست بازنشانی رمز عبور</h2>
          <p>کاربر گرامی،</p>
          <p>کد بازنشانی رمز شما:</p>
          <h3 style="color: #2d89ef;">${resetToken}</h3>
          <p>این کد تا <strong>۱۰ دقیقه</strong> معتبر است.</p>
          <p>اگر شما این درخواست را انجام نداده‌اید، لطفاً این پیام را نادیده بگیرید.</p>
        </div>
      `,
    };

    // ✅ Send email automatically
    await transporter.sendMail(mailOptions);

    res.json({
      message: "Reset token created and email sent successfully",
      email,
      expiresAt: resetTokenExpiry,
    });
  } catch (err) {
    console.error("❌ Error in checkEmail:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Step 2: Verify reset token
exports.checkResetToken = async (req, res) => {
  try {
    const { email, resetToken } = req.body;

    const user = await user_model.findOne({
      where: {
        email,
        resetToken,
        resetTokenExpiry: { [Op.gt]: new Date() }, // not expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.json({ message: "Reset token verified successfully" });
  } catch (err) {
    console.error("Error in checkResetToken:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Step 3: Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const user = await user_model.findOne({
      where: {
        email,
        resetToken,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password and clear reset fields
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // ✅ Save the instance, not the model
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

