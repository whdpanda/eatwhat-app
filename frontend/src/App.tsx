import React, { useState } from 'react';
import './App.css'; // 确保引入

const DISTANCE_OPTIONS = [
  { label: '1公里', value: 1000 },
  { label: '3公里', value: 3000 },
  { label: '5公里', value: 5000 },
  { label: '10公里', value: 10000 },
];

const PRICE_OPTIONS = [
  { label: '无上限', value: -1 },
  { label: '¥1000', value: 1000 },
  { label: '¥2000', value: 2000 },
  { label: '¥3000', value: 3000 },
  { label: '¥5000', value: 5000 },
  { label: '¥10000', value: 10000 },
];

type Restaurant = {
  name: string;
  rating: number;
  types: string[];
  address: string;
  url?: string;
};

function App() {
  const [distance, setDistance] = useState(1000);
  const [price, setPrice] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const API_URL = 'https://eatwhat-backend-env.eba-k3yp4mmj.ap-southeast-2.elasticbeanstalk.com';
  // const API_URL = 'http://localhost:8080'; // 本地开发时使用
  // 获取当前地理位置
  function getLocation(): Promise<{lat: number, lng: number}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('无法获取定位'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => reject(new Error('定位失败'))
        );
      }
    });
  }

  // 点击Random按钮
  async function handleRandom() {
    setLoading(true);
    setError('');
    setRestaurants([]);
    try {
      const {lat, lng} = await getLocation();

      // 发送到你自己的API
      // const res = await fetch('/api/random-restaurants', {
      const res = await fetch(`${API_URL}/api/random-restaurants`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          distance,
          price,
        }),
      });
      if (!res.ok) throw new Error('API请求失败');
      const data = await res.json();
      setRestaurants(data.restaurants); // 后端返回 { restaurants: Restaurant[] }
    } catch (e: any) {
      setError(e.message || '发生未知错误');
    }
    setLoading(false);
  }

  return (
    <div className="app-container">
      <h1>吃什么推荐器</h1>
      <div style={{ marginBottom: 22 }}>
        <label>
          位置范围:
          <select
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
          >
            {DISTANCE_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label>
          预算上限:
          <select
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          >
            {PRICE_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </label>
      </div>
      <button
        onClick={handleRandom}
        disabled={loading}
        className="button-main"
      >
        {loading ? '查询中...' : 'Random'}
      </button>
      <div className="restaurant-list">
        {error && <div className="error-msg">{error}</div>}
        {restaurants.length > 0 && (
          <ul style={{ paddingLeft: 0 }}>
            {restaurants.map((r, idx) => (
              <li className="restaurant-item" key={idx} style={{ listStyle: 'none' }}>
                <div><b>{r.name}</b></div>
                <div>评分: {r.rating}</div>
                <div>类型: {r.types.join('、')}</div>
                <div>地址: {r.address}</div>
                {r.url && <div><a href={r.url} target="_blank" rel="noopener noreferrer">详情</a></div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
