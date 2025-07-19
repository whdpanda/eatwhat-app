const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', restaurantRoutes);

const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
