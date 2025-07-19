import React, { useState } from 'react';
import RestaurantSearchForm, { Restaurant } from '../components/RestaurantSearchForm';
import RestaurantList from '../components/RestaurantList';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {/* 这里不需要再渲染 <h1>，主标题交给App.tsx或Header.tsx统一管理 */}
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
