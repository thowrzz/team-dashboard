import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch weather for Trivandrum from wttr.in
    const res = await fetch('https://wttr.in/Trivandrum?format=j1');
    const data = await res.json();
    
    const current = data.current_condition[0];
    const today = data.weather[0];
    
    return NextResponse.json({
      location: 'Trivandrum, Kerala',
      temperature: current.temp_C,
      feelsLike: current.FeelsLikeC,
      condition: current.weatherDesc[0].value,
      humidity: current.humidity,
      windSpeed: current.windspeedKmph,
      icon: getWeatherIcon(current.weatherCode),
      maxTemp: today.maxtempC,
      minTemp: today.mintempC,
      sunrise: today.astronomy[0].sunrise,
      sunset: today.astronomy[0].sunset,
      hourlyForecast: data.weather[0].hourly.slice(0, 6).map((h: any) => ({
        time: h.time,
        temp: h.tempC,
        condition: h.weatherDesc[0].value
      }))
    });
  } catch (error) {
    return NextResponse.json({
      location: 'Trivandrum, Kerala',
      temperature: '--',
      condition: 'Unable to fetch',
      icon: '🌡️',
      error: true
    });
  }
}

function getWeatherIcon(code: string): string {
  const icons: Record<string, string> = {
    '113': '☀️', // Sunny
    '116': '⛅', // Partly cloudy
    '119': '☁️', // Cloudy
    '122': '☁️', // Overcast
    '176': '🌧️', // Light rain
    '200': '⛈️', // Thunderstorm
    '248': '🌫️', // Fog
    '263': '🌧️', // Light rain
    '266': '🌧️', // Light drizzle
    '293': '🌧️', // Light rain
    '296': '🌧️', // Light rain
    '299': '🌧️', // Moderate rain
    '302': '🌧️', // Moderate rain
    '305': '🌧️', // Heavy rain
    '308': '🌧️', // Heavy rain
    '311': '🌧️', // Light freezing rain
    '314': '🌧️', // Moderate freezing rain
    '317': '🌨️', // Light sleet
    '320': '🌨️', // Moderate sleet
    '323': '🌨️', // Light snow
    '326': '🌨️', // Light snow
    '329': '❄️', // Moderate snow
    '338': '❄️', // Heavy snow
    '350': '❄️', // Ice pellets
    '353': '🌧️', // Light rain shower
    '356': '🌧️', // Moderate rain shower
    '359': '🌧️', // Torrential rain shower
    '362': '🌨️', // Light sleet showers
    '365': '🌨️', // Moderate sleet showers
    '368': '🌨️', // Light snow showers
    '371': '❄️', // Moderate snow showers
    '374': '❄️', // Light ice pellets
    '377': '❄️', // Moderate ice pellets
    '386': '⛈️', // Light rain with thunderstorm
    '389': '⛈️', // Moderate rain with thunderstorm
    '392': '⛈️', // Light snow with thunderstorm
    '395': '⛈️', // Moderate snow with thunderstorm
  };
  return icons[code] || '🌡️';
}
