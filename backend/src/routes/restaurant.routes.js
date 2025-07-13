const express = require('express');
const router = express.Router();
const { randomRestaurants } = require('../controllers/restaurant.controller');

router.post('/random-restaurants', randomRestaurants);

module.exports = router;
