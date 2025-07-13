const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

/**
 * 价格等级说明（Google Places API）：
 * 0=最便宜, 1=便宜, 2=中档, 3=昂贵, 4=最贵
 * 这里只根据预算做简单映射（如需更细致映射可自定义）
 */
function getPriceLevel(budget) {
  if (budget < 0) return undefined;
  if (budget <= 1000) return 0;
  if (budget <= 2000) return 1;
  if (budget <= 3000) return 2;
  if (budget <= 5000) return 3;
  if (budget <= 10000) return 4;
  return 5;
}

app.post('/api/random-restaurants', async (req, res) => {
  const { latitude, longitude, distance, price } = req.body;
  if (!latitude || !longitude || !distance) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const params = {
    key: process.env.GOOGLE_MAPS_API_KEY,
    location: `${latitude},${longitude}`,
    radius: distance,
    type: 'restaurant',
    language: 'zh-CN',
  };

  const priceLevel = getPriceLevel(price);
  if (priceLevel !== undefined) params.maxprice = priceLevel;

  try {
    // 调用 Google Places Nearby Search API
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const response = await axios.get(url, { params });
    const results = response.data.results;

    if (!results || results.length === 0) {
      return res.json({ restaurants: [] });
    }

    // 随机挑选 5 家
    const picked = results
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        rating: item.rating,
        types: item.types || [],
        address: item.vicinity || item.formatted_address || '',
        url: item.place_id
          ? `https://www.google.com/maps/place/?q=place_id:${item.place_id}`
          : undefined,
      }));

    res.json({ restaurants: picked });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'API 请求失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
