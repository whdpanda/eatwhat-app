import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

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

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

type Restaurant = {
  name: string;
  rating: number;
  types: string[];
  address: string;
  url?: string;
};

function App() {
  const { t, i18n } = useTranslation();
  const [distance, setDistance] = useState(1000);
  const [price, setPrice] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const API_URL = 'https://eatwhat-backend-env.eba-k3yp4mmj.ap-southeast-2.elasticbeanstalk.com';
  // const API_URL = 'http://localhost:8080'; // 本地开发时使用

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  React.useEffect(() => {
    if (!langMenuOpen) return;
    function closeMenu() { setLangMenuOpen(false); }
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [langMenuOpen]);

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

  async function handleRandom() {
    setLoading(true);
    setError('');
    setRestaurants([]);
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
      setRestaurants(data.restaurants);
    } catch (e: any) {
      setError(e.message || '发生未知错误');
    }
    setLoading(false);
  }

return (
  <div className="app-container" style={{ position: 'relative' }}>
    {/* 语言切换菜单在卡片右上角 */}
    <div style={{
      position: 'absolute',
      top: 30,
      right: 30,
      zIndex: 20
    }}>
      <div
  className={`lang-switch${langMenuOpen ? ' open' : ''}`}
  onClick={e => {
    e.stopPropagation();
    setLangMenuOpen(v => !v);
  }}
>
  <span>{currentLang.label}</span>
  <span className="lang-switch-arrow">▼</span>
</div>
{langMenuOpen && (
  <div
    className="lang-menu"
    onClick={e => e.stopPropagation()}
  >
    {LANGUAGES.filter(lang => lang.code !== currentLang.code)
      .map(lang => (
        <div
          key={lang.code}
          className="lang-menu-item"
          onClick={() => {
            i18n.changeLanguage(lang.code);
            setLangMenuOpen(false);
          }}
        >
          {lang.label}
        </div>
      ))}
  </div>
)}

    </div>

      {/* ...下方你的原有业务内容都保持不变 */}
      <h1>{t('title')}</h1>
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
        onClick={handleRandom}
        disabled={loading}
        className="button-main"
      >
        {loading ? t('loading') : t('random')}
      </button>
      <div className="restaurant-list">
        {error && <div className="error-msg">{error}</div>}
        {restaurants.length > 0 && (
          <ul style={{ paddingLeft: 0 }}>
            {restaurants.map((r, idx) => (
              <li className="restaurant-item" key={idx} style={{ listStyle: 'none' }}>
                <div><b>{r.name}</b></div>
                <div>{t('score')}: {r.rating}</div>
                <div>{t('type')}: {r.types.join('、')}</div>
                <div>{t('address')}: {r.address}</div>
                {r.url && <div><a href={r.url} target="_blank" rel="noopener noreferrer">{t('detail')}</a></div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
