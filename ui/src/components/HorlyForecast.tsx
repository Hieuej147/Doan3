import React, { useRef } from "react";
import "./HorlyForecast.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface HourlyData {
  time: string;
  temp_c: number;
  condition: { icon: string };
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
}

const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Dữ liệu mặc định nếu không có hourlyData
  const defaultData = [
    { time: "14:00", temp_c: 5, condition: { icon: "/9273967.jpg" } },
    { time: "15:00", temp_c: 6, condition: { icon: "/9273967.jpg" } },
    { time: "16:00", temp_c: 4, condition: { icon: "/9273967.jpg" } },
    { time: "17:00", temp_c: 3, condition: { icon: "/9273967.jpg" } },
    { time: "18:00", temp_c: 2, condition: { icon: "/9273967.jpg" } },
    { time: "19:00", temp_c: 1, condition: { icon: "/9273967.jpg" } },
    { time: "20:00", temp_c: 0, condition: { icon: "/9273967.jpg" } },
  ];

  const data = hourlyData.length > 0 ? hourlyData : defaultData;

  return (
    <div className="mt-6 relative">
      <div
        ref={scrollRef}
        className="mx-10 py-2 flex gap-4 overflow-x-auto scrollbar-hide"
      >
        {data.map((forecast, index) => (
          <div
            key={index}
            className="flex flex-col items-center shadow-lg bg-blue-100 rounded px-4 py-2 min-w-[100px]"
          >
            <p>
              {new Date(forecast.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <img
              src={forecast.condition.icon}
              alt="weather icon"
              className="w-10 mx-auto"
            />
            <p>{forecast.temp_c}°C</p>
          </div>
        ))}
      </div>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 bg-green-500 text-white transform -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center"
      >
        <FaChevronLeft size="20" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 bg-green-500 text-white transform -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center"
      >
        <FaChevronRight size="20" />
      </button>
    </div>
  );
};

export default HourlyForecast;
