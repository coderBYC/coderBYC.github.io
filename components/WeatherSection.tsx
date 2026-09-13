"use client";

import { useEffect, useState } from "react";
import { fetchAnnArborWeather, type AnnArborWeather } from "@/lib/weather";

export default function WeatherSection() {
  const [weather, setWeather] = useState<AnnArborWeather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAnnArborWeather()
      .then((next) => {
        if (!cancelled) setWeather(next);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="aero-weather text-black">
      <p className="text-sm tracking-wide text-black/45">Ann Arbor</p>
      {error && <p className="mt-3 text-black/70">Weather is unavailable right now.</p>}
      {!error && !weather && <p className="mt-3 text-black/70">Loading weather...</p>}
      {weather && (
        <>
          <p className="aero-weather-temp mt-2 text-6xl leading-none text-black">{weather.temp}°F</p>
          <p className="mt-2 text-lg text-black/80">{weather.label}</p>
          <p className="text-black/60">
            H {weather.high}° · L {weather.low}°
          </p>
          <dl className="mt-5 flex gap-6 text-sm">
            <div>
              <dt className="text-black/45">Feels like</dt>
              <dd className="text-black">{weather.feelsLike}°F</dd>
            </div>
            <div>
              <dt className="text-black/45">Humidity</dt>
              <dd className="text-black">{weather.humidity}%</dd>
            </div>
            <div>
              <dt className="text-black/45">Wind</dt>
              <dd className="text-black">{weather.wind} mph</dd>
            </div>
          </dl>
        </>
      )}
    </div>
  );
}
