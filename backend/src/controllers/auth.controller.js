// controllers/auth.controller.js
// 临时：硬编码一个测试用户
const USERS = [
  { username: 'test', password: '123456' }  // 真实项目里不要明文存密码
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  // 简单校验
  if (!username || !password) {
    return res.status(400).json({ error: '缺少用户名或密码' });
  }
  // 查找用户
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  // 登录成功（先不发token，仅返回成功）
  return res.json({ success: true, username: user.username });
};
