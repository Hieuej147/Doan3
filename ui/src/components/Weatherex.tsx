import HourlyForecast from "../components/HorlyForecast";

interface WeatherData {
  location: { name: string };
  current: { temp_c: number; condition: { text: string; icon: string } };
  forecast: {
    forecastday: {
      hour: { time: string; temp_c: number; condition: { icon: string } }[];
    }[];
  };
}

interface WeatherexProps {
  weatherData?: WeatherData;
}

const Weatherex = ({ weatherData }: WeatherexProps) => {
  // Dữ liệu mặc định nếu không có weatherData
  const defaultData = {
    location: { name: "Madrid" },
    current: { temp_c: 2, condition: { text: "Cloudy", icon: "/9273967.jpg" } },
    forecast: { forecastday: [{ hour: [] }] },
  };

  const data = weatherData || defaultData;

  return (
    <div className="text-center max-w-sm bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] rounded-3xl">
      <h2 className="text-xl font-semibold p-10">{data.location.name}</h2>
      <img
        src={data.current.condition.icon}
        alt="weather icon"
        className="mx-auto"
      />
      <p className="text-lg font-semibold">{data.current.temp_c}°C</p>
      <p className="text-sm font-semibold">{data.current.condition.text}</p>
      <HourlyForecast hourlyData={data.forecast.forecastday[0]?.hour || []} />
    </div>
  );
};

export default Weatherex;
