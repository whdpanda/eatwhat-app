// backend/src/models/user.model.js
const dynamoDB = require('../utils/dynamodb');

const USERS_TABLE = 'users'; // DynamoDB 表名

// 初始化（DynamoDB 无需初始化表结构）
async function init() {
  // 可加日志：console.log('User model initialized');
}

// 根据用户名查找用户
async function findUserByUsername(username) {
  const params = {
    TableName: USERS_TABLE,
    Key: { username },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

// 根据邮箱查找用户（邮箱不是主键，需要全表扫描，生产建议建二级索引）
async function findUserByEmail(email) {
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email',
    },
    ExpressionAttributeValues: {
      ':email': email,
    },
  };
  const result = await dynamoDB.scan(params).promise();
  // scan 可能返回多个，实际注册时应唯一
  return result.Items && result.Items[0];
}

// 创建新用户（带邮箱及邮箱验证相关字段）
async function createUser({
  username,
  password,
  email,
  emailVerified = false,
  emailVerificationCode = null,
  emailVerificationExpires = null,
}) {
  // 查重：用户名和邮箱都不可重复
  const exist = await findUserByUsername(username);
  if (exist) return null;
  const existEmail = await findUserByEmail(email);
  if (existEmail) return null;

  // 构造写入参数
  const params = {
    TableName: USERS_TABLE,
    Item: {
      username,
      password,
      email,
      emailVerified,
      emailVerificationCode,
      emailVerificationExpires,
    },
    ConditionExpression: 'attribute_not_exists(username)', // 防并发
  };
  try {
    await dynamoDB.put(params).promise();
    return { username, email };
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return null;
    }
    throw err;
  }
}

// 根据邮箱更新用户（用于邮箱验证后更新状态等）
async function updateUserByEmail(email, updateObj) {
  // 先查到用户名
  const user = await findUserByEmail(email);
  if (!user) return null;
  const username = user.username;

  // 动态构造 UpdateExpression
  let UpdateExpression = 'set ';
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const updates = [];

  for (const key in updateObj) {
    updates.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updateObj[key];
  }
  UpdateExpression += updates.join(', ');

  const params = {
    TableName: USERS_TABLE,
    Key: { username },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };

  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}

module.exports = {
  init,
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUserByEmail,
};
