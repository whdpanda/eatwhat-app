import React from "react";
import { useTranslation } from "react-i18next";

// 币种选项
const CURRENCY_OPTIONS = [
  { code: "CNY", label: "CNY" },
  { code: "USD", label: "USD" },
  { code: "JPY", label: "JPY" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
];

// 每种币种下预算选项
const PRICE_OPTIONS_MAP: Record<string, { label: string; value: number }[]> = {
  CNY: [
    { label: "", value: -1 },
    { label: "¥100", value: 100 },
    { label: "¥200", value: 200 },
    { label: "¥300", value: 300 },
    { label: "¥500", value: 500 },
    { label: "¥1000", value: 1000 },
  ],
  USD: [
    { label: "", value: -1 },
    { label: "$10", value: 10 },
    { label: "$30", value: 30 },
    { label: "$50", value: 50 },
    { label: "$100", value: 100 },
    { label: "$200", value: 200 }
  ],
  JPY: [
    { label: "", value: -1 },
    { label: "¥1000", value: 1000 },
    { label: "¥2000", value: 2000 },
    { label: "¥3000", value: 3000 },
    { label: "¥5000", value: 5000 },
    { label: "¥10000", value: 10000 },
  ],
  EUR: [
    { label: "", value: -1 },
    { label: "€10", value: 10 },
    { label: "€30", value: 30 },
    { label: "€50", value: 50 },
    { label: "€100", value: 100 },
    { label: "€200", value: 200 }
  ],
  GBP: [
    { label: "", value: -1 },
    { label: "£10", value: 10 },
    { label: "£30", value: 30 },
    { label: "£50", value: 50 },
    { label: "£100", value: 100 },
    { label: "£200", value: 200 }
  ],
};

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

export default function RestaurantSearchForm({
  onResult,
  onError,
  setLoading,
}: Props) {
  const { t } = useTranslation();
  const [distance, setDistance] = React.useState(1000);

  // 新增币种 state
  const [currency, setCurrency] = React.useState("CNY");
  // 预算 state（随币种切换重置）
  const [price, setPrice] = React.useState(-1);

  const API_URL = "https://api.randomeatwhat.com";
  // const API_URL = 'http://localhost:8080';

  function getLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("无法获取定位"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => reject(new Error("定位失败"))
        );
      }
    });
  }

  // 切换币种时，重置预算为 -1
  React.useEffect(() => {
    setPrice(-1);
  }, [currency]);

  async function handleRandom(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onError("");
    onResult([]);
    try {
      const { lat, lng } = await getLocation();
      const res = await fetch(`${API_URL}/api/random-restaurants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          distance,
          price,
          currency, // 将币种也发送到后端
        }),
      });
      if (!res.ok) throw new Error("API请求失败");
      const data = await res.json();
      onResult(data.restaurants);
    } catch (e: any) {
      onError(e.message || "发生未知错误");
    }
    setLoading(false);
  }

  // 当前币种的预算选项
  const priceOptions = PRICE_OPTIONS_MAP[currency];

  return (
    <form className="restaurant-form" onSubmit={handleRandom}>
      <div className="form-item">
        <label>
          {t("distance")}:
          <select
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          >
            {[
              { label: "1km", value: 1000 },
              { label: "3km", value: 3000 },
              { label: "5km", value: 5000 },
              { label: "10km", value: 10000 },
            ].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-item">
        <label>
          {t("budget")}:
          <select
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="budget-select"
          >
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-select"
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="button-main form-button">
        {t("random")}
      </button>
    </form>
  );
}
