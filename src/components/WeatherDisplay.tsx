import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  location: string;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherDisplayProps {
  weather: WeatherData;
}

const getWeatherIcon = (iconCode: string) => {
  const code = iconCode.substring(0, 2);

  const iconMap: { [key: string]: JSX.Element } = {
    '01': <Sun className="w-12 h-12 text-yellow-400" />,
    '02': <Cloud className="w-12 h-12 text-gray-400" />,
    '03': <Cloud className="w-12 h-12 text-gray-400" />,
    '04': <Cloud className="w-12 h-12 text-gray-500" />,
    '09': <CloudRain className="w-12 h-12 text-blue-400" />,
    '10': <CloudRain className="w-12 h-12 text-blue-500" />,
    '11': <CloudRain className="w-12 h-12 text-purple-500" />,
    '13': <CloudSnow className="w-12 h-12 text-blue-200" />,
    '50': <Wind className="w-12 h-12 text-gray-400" />,
  };

  return iconMap[code] || <Cloud className="w-12 h-12 text-gray-400" />;
};

export const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{weather.location}</h3>
          <p className="text-gray-600 mt-1">{weather.description}</p>
        </div>
        <div className="bg-white rounded-full p-4 shadow-md">
          {getWeatherIcon(weather.icon)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">気温</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</p>
          <p className="text-xs text-gray-500 mt-1">体感 {Math.round(weather.feelsLike)}°C</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">湿度</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{weather.humidity}%</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">風速</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{weather.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
};
