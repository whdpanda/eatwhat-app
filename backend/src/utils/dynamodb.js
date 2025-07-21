const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  // accessKeyId/secretAccessKey 可省略，已配置环境变量
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
