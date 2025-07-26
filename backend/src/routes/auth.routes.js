const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 用户登录
// POST /api/auth/login
router.post('/login', authController.login);

// 用户注册（含邮箱注册与验证码邮件发送）
// POST /api/auth/register
router.post('/register', authController.register);

// 新增：邮箱验证码验证接口
// POST /api/auth/verify-email
// 参数: { email, code }
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
