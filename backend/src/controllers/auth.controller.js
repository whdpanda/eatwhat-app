const { findUserByUsername, createUser } = require('../models/user.model');

// 登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '缺少用户名或密码' });

  const user = await findUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  // 登录成功（可扩展 JWT token 等）
  res.json({ message: '登录成功', username: user.username });
};

// 注册
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '缺少用户名或密码' });

  // 用户名重复检查
  const existingUser = await findUserByUsername(username);
  if (existingUser)
    return res.status(409).json({ error: '用户名已存在' });

  // （可扩展密码长度/安全性检查）
  await createUser({ username, password });
  res.json({ message: '注册成功', username });
};

