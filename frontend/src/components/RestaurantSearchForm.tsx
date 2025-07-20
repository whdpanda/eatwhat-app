import React from 'react';
import { useTranslation } from 'react-i18next';

const DISTANCE_OPTIONS = [
  { label: '1km', value: 1000 },
  { label: '3km', value: 3000 },
  { label: '5km', value: 5000 },
  { label: '10km', value: 10000 },
];

const PRICE_OPTIONS = [
  { label: '', value: -1 },
  { label: '¥1000', value: 1000 },
  { label: '¥2000', value: 2000 },
  { label: '¥3000', value: 3000 },
  { label: '¥5000', value: 5000 },
  { label: '¥10000', value: 10000 },
];

export type Restaurant = {
  name: string;
  rating: number;
  types: string[];
  address: string;
  url?: string;
};

type Props = {
  onResult: (restaurants: Restaurant[]) => void;
  onError: (msg: string) => void;
  setLoading: (b: boolean) => void;
};

export default function RestaurantSearchForm({ onResult, onError, setLoading }: Props) {
  const { t } = useTranslation();
  const [distance, setDistance] = React.useState(1000);
  const [price, setPrice] = React.useState(-1);

  const API_URL = 'https://api.randomeatwhat.com';
//   const API_URL = 'http://localhost:8080'; // 本地开发时使用

  function getLocation(): Promise<{ lat: number, lng: number }> {
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

  async function handleRandom(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onError('');
    onResult([]);
    try {
      const { lat, lng } = await getLocation();
      const res = await fetch(`${API_URL}/api/random-restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          distance,
          price,
        }),
      });
      if (!res.ok) throw new Error('API请求失败');
      const data = await res.json();
      onResult(data.restaurants);
    } catch (e: any) {
      onError(e.message || '发生未知错误');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleRandom}>
      <div style={{ marginBottom: 22 }}>
        <label>
          {t('distance')}:
          <select value={distance} onChange={e => setDistance(Number(e.target.value))}>
            {DISTANCE_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label>
          {t('budget')}:
          <select value={price} onChange={e => setPrice(Number(e.target.value))}>
            {PRICE_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="button-main"
        style={{ marginTop: 10 }}
      >
        {t('random')}
      </button>
    </form>
  );
}
