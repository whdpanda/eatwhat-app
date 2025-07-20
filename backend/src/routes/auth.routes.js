// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);

// 新增注册路由
router.post('/register', authController.register);

module.exports = router;
