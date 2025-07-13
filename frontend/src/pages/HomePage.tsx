import React, { useState } from 'react';
import RestaurantSearchForm, { Restaurant } from '../components/RestaurantSearchForm';
import RestaurantList from '../components/RestaurantList';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <h1 style={{ marginTop: 30 }}>{/* 由 App.tsx 控制i18n */}</h1>
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
    </>
  );
}
