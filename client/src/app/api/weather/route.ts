import { NextResponse } from 'next/server';

/**
 * Analytics / dashboard weather proxy (Next.js → OpenWeatherMap).
 * Pincode-based weather uses Express via /api/weather/by-pincode/* (see next.config rewrites).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '30.9010';
  const lon = searchParams.get('lon') || '75.8573';
  const pincode = searchParams.get('pincode');
  const country = searchParams.get('country') || 'IN';
  const type = searchParams.get('type') || 'current';
  const apiKey =
    process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'Weather API key not configured',
        message: 'Set OPENWEATHER_API_KEY in server/.env or client env for live weather.',
      },
      { status: 503 }
    );
  }

  try {
    if (type === 'current') {
      const currentUrl = pincode
        ? `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(pincode)},${encodeURIComponent(country)}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(currentUrl, { cache: 'no-store' });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenWeatherMap current weather failed:', response.status, errorText);
        return NextResponse.json(
          {
            error: 'Weather provider error',
            message: 'Unable to fetch current weather. Check OPENWEATHER_API_KEY.',
          },
          { status: 502 }
        );
      }
      const data = await response.json();
      return NextResponse.json({
        temp: Math.round(data.main?.temp ?? 0),
        humidity: data.main?.humidity ?? 0,
        windSpeed: data.wind?.speed ?? 0,
        condition: data.weather?.[0]?.main ?? 'Unknown',
        icon: data.weather?.[0]?.icon ?? '',
        location: data.name ?? (pincode ? `Pincode ${pincode}` : 'Ludhiana'),
        recordedAt: new Date().toISOString(),
      });
    }

    if (type === 'forecast') {
      const forecastUrl = pincode
        ? `https://api.openweathermap.org/data/2.5/forecast?zip=${encodeURIComponent(pincode)},${encodeURIComponent(country)}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(forecastUrl, { cache: 'no-store' });
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Weather provider error', message: 'Unable to fetch forecast.' },
          { status: 502 }
        );
      }
      return NextResponse.json(await response.json());
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
