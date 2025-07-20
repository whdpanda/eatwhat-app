const { findUserByUsername } = require('../models/user.model');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '缺少用户名或密码' });

  const user = await findUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  // 这里只返回登录成功（实际可加 token 认证等）
  res.json({ message: '登录成功', username: user.username });
};
