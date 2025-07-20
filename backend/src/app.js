const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurant.routes');
const authRoutes = require('./routes/auth.routes');
const { init } = require('./models/user.model'); // NEW    

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', restaurantRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// 初始化数据库
init();

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
