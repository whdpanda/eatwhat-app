// backend/src/models/user.model.js
const { Low, JSONFile } = require('lowdb');
const path = require('path');

// 数据库路径
const db = new Low(new JSONFile(path.join(__dirname, '../../db.json')));

// 初始化数据库（首次运行/无数据时保证 users 数组存在）
async function init() {
  await db.read();
  db.data ||= { users: [] }; // Node 14+ 支持 ||=
  await db.write();
}

// 查询用户
async function findUserByUsername(username) {
  await db.read();
  return db.data.users.find(u => u.username === username);
}

// 新建用户（注册用），如已存在返回 null
async function createUser(username, password) {
  await db.read();
  if (db.data.users.find(u => u.username === username)) {
    return null; // 已存在
  }
  db.data.users.push({ username, password });
  await db.write();
  return { username };
}

module.exports = {
  init,
  findUserByUsername,
  createUser,
};
