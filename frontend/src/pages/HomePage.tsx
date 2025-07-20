import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantSearchForm, { Restaurant } from '../components/RestaurantSearchForm';
import RestaurantList from '../components/RestaurantList';

export default function HomePage() {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>{t('title')}</h1>
      <RestaurantSearchForm
        onResult={setRestaurants}
        onError={setError}
        setLoading={setLoading}
      />
      <RestaurantList
        restaurants={restaurants}
        error={error}
        loading={loading}
      />
    </div>
  );
}
