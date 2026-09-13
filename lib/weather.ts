export type AnnArborWeather = {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  high: number;
  low: number;
  label: string;
};

const FORECAST =
  "https://api.open-meteo.com/v1/forecast?latitude=42.2808&longitude=-83.743&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FDetroit&forecast_days=1";

export function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

export async function fetchAnnArborWeather(): Promise<AnnArborWeather> {
  const response = await fetch(FORECAST);
  if (!response.ok) throw new Error("Weather unavailable");
  const data = await response.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    wind: Math.round(data.current.wind_speed_10m),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    label: weatherLabel(data.current.weather_code),
  };
}
