import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Restaurant } from './RestaurantSearchForm';

type Props = {
  restaurants: Restaurant[];
  error: string;
  loading: boolean;
};

export default function RestaurantList({ restaurants, error, loading }: Props) {
  const { t } = useTranslation();
  return (
    <div className="restaurant-list">
      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="error-msg">{t('loading')}</div>}
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
  );
}
