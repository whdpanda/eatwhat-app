// backend/src/models/user.model.js
const dynamoDB = require('../utils/dynamodb');

const USERS_TABLE = 'users'; // DynamoDB 表名

// 初始化（兼容旧代码，DynamoDB 无需表结构初始化）
async function init() {
  // 这里可以留空，或者加日志说明
}

/**
 * 根据用户名查找用户
 * @param {string} username - 要查找的用户名（分区键）
 * @returns {Promise<Object|undefined>} - 用户对象或未找到返回 undefined
 */
async function findUserByUsername(username) {
  // 构造 DynamoDB 查询参数，Key 字段名要和表主键完全一致
  const params = {
    TableName: USERS_TABLE,
    Key: { username },
  };
  // 调用 DynamoDB get 方法，返回结果对象
  const result = await dynamoDB.get(params).promise();
  // 如果找到，返回用户对象（包含用户名和密码），否则返回 undefined
  return result.Item;
}

/**
 * 创建新用户（注册）
 * @param {Object} user - 用户对象，包含 username 和 password
 * @returns {Promise<Object|null>} - 创建成功返回 { username }，已存在返回 null
 */
async function createUser({ username, password }) {
  // 先查重，防止用户名重复
  const exist = await findUserByUsername(username);
  if (exist) {
    return null; // 用户名已存在
  }
  // 构造 DynamoDB 插入参数
  const params = {
    TableName: USERS_TABLE,
    Item: { username, password }, // 可以扩展更多字段
    ConditionExpression: 'attribute_not_exists(username)', // 并发写入防止重复
  };
  try {
    // put 成功写入新用户
    await dynamoDB.put(params).promise();
    return { username };
  } catch (err) {
    // 并发冲突时再兜底返回 null
    if (err.code === 'ConditionalCheckFailedException') {
      return null;
    }
    throw err; // 其他错误抛出
  }
}

module.exports = {
  init,
  findUserByUsername,
  createUser,
};
