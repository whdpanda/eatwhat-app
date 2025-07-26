const {
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUserByEmail,
} = require('../models/user.model');
const { sendVerificationEmail } = require('../utils/mailer');

// 登录（仅允许已邮箱验证用户登录）
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '缺少用户名或密码' });

  const user = await findUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  // 需要邮箱验证才能登录
  if (!user.emailVerified) {
    return res.status(403).json({ error: '邮箱未验证，请先验证邮箱' });
  }
  // 登录成功（可扩展 JWT token）
  res.json({ message: '登录成功', username: user.username });
};

// 注册（必须邮件发送成功后才写入用户）
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ error: '缺少用户名、密码或邮箱' });

  // 检查用户名是否存在
  const existingUser = await findUserByUsername(username);
  if (existingUser)
    return res.status(409).json({ error: '用户名已存在' });

  // 检查邮箱是否存在
  const existingEmailUser = await findUserByEmail(email);
  if (existingEmailUser)
    return res.status(409).json({ error: '邮箱已被注册' });

  // 生成6位数字验证码和10分钟过期时间
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10分钟有效

  // **先尝试发邮件，失败则不存用户**
  try {
    await sendVerificationEmail(email, code);
  } catch (e) {
    // 邮件发送失败，注册流程终止
    console.error('验证码邮件发送失败:', e);
    return res.status(500).json({ error: '验证码邮件发送失败，请稍后再试' });
  }

  // 邮件发成功后，才写入数据库
  await createUser({
    username,
    password,
    email,
    emailVerified: false,
    emailVerificationCode: code,
    emailVerificationExpires: expires,
  });

  res.json({ message: '注册成功，请查收邮箱完成验证', username });
};

// 邮箱验证码验证
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ error: '缺少邮箱或验证码' });

  const user = await findUserByEmail(email);
  if (!user)
    return res.status(404).json({ error: '用户不存在' });

  if (user.emailVerified)
    return res.status(400).json({ error: '邮箱已验证' });

  if (user.emailVerificationCode !== code)
    return res.status(400).json({ error: '验证码错误' });

  if (Date.now() > user.emailVerificationExpires)
    return res.status(400).json({ error: '验证码已过期' });

  // 验证通过，更新用户
  await updateUserByEmail(email, {
    emailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpires: null,
  });

  res.json({ message: '邮箱验证成功' });
};
