// backend/src/utils/mailer.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // 读取.env配置

// 创建SMTP邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 465,
  secure: process.env.MAIL_SECURE === 'true', // true为465端口，false为587端口
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // QQ邮箱等需要授权码
  },
});

// 发送验证码邮件
async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: process.env.MAIL_FROM, // 发件人
    to, // 收件人
    subject: '【EatWhat】邮箱验证',
    text: `您好，您的邮箱验证码是：${code}（10分钟内有效）`,
    html: `<div>
      <p>您好，</p>
      <p>您的邮箱验证码是：<b style="font-size:1.3em">${code}</b></p>
      <p>验证码10分钟内有效，请及时填写。</p>
      <br>
      <p>EatWhat 团队</p>
    </div>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
};
