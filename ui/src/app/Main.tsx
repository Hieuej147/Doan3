import { ResearchCanvas } from "@/components/ResearchCanvas";
import { useModelSelectorContext } from "@/lib/model-selector-provider";
import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
// import { CopilotChat } from "@copilotkit/react-ui";
// import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
// import { CopilotSidebar } from "@copilotkit/react-ui";
// import { SuppressHydrationWarning } from "@/components/SuppressHydrationWarning";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import React, { useEffect, useState } from "react";
import { stringify } from "querystring";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import axios from "axios";
import Weatherex from "@/components/Weatherex";

export function WeatherWidgetViaCopilot() {
  const [weather, setWeather] = useState<any>(null); // Lưu dữ liệu thời tiết
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY!;
  useCopilotAction({
    name: "showWeather",
    description: "Display weather using WeatherWidget by location name",
    parameters: [
      {
        name: "location",
        type: "string",
        description: "The city to display weather for",
        required: true,
      },
    ],
    handler: async ({ location }) => {
      const weather_url = "http://api.weatherapi.com/v1/forecast.json";
      try {
        const res = await axios.get(
          `${weather_url}?key=${apiKey}&q=${location}&days=1`
        );
        setWeather(res.data); // Lưu dữ liệu vào state
        console.log("Weather data:", res.data);
        return { location, data: res.data }; // Trả về dữ liệu cho render
      } catch (error) {
        console.error("Error fetching weather:", error);
        return { location, data: null };
      }
    },
    render: ({ status, result }) => {
      if (status === "executing") {
        return <div>Loading weather data...</div>;
      }
      if (!result?.data || !apiKey) {
        return <Weatherex />; // Trả về component mặc định nếu không có dữ liệu
      }

      return <Weatherex weatherData={result.data} />; // Truyền dữ liệu vào Weatherex
    },
  });

  return null; // Component này chỉ xử lý logic, không render trực tiếp
}
export default function Main() {
  const [themeColor, setThemeColor] = useState(
    "--copilot-kit-background-color"
  );
  const { model, agent } = useModelSelectorContext();

  const { state, setState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
      research_question: "",
      resources: [],
      report: "",
      logs: [],
      weather: "",
    },
  });
  useCopilotAction({
    name: "setThemeColor",
    parameters: [
      {
        name: "themeColor",
        description:
          "Change the theme color of the chat. Can be anything that the CSS theme attribute accepts. Regular colors, linear of radial gradients etc.",
        required: true,
      },
    ],
    handler({ themeColor }) {
      console.log("Color change: ", themeColor);
      setThemeColor(themeColor);
    },
  });

  useCopilotChatSuggestions({
    instructions: "Lifespan of penguins",
  });

  return (
    <>
      {/* <SuppressHydrationWarning /> */}
      <h1
        className="flex h-[60px] items-center justify-between px-10 text-2xl font-semibold 
             text-white bg-gradient-to-r from-[#1d1655] via-[#393087] to-[#5b52b4] 
             shadow-md animate-fade-in"
      >
        <span className="tracking-wide">🚀 Research and Plan AI</span>
      </h1>

      <div
        className="flex flex-1 border"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="flex-1 overflow-hidden">
          <ResearchCanvas themeColor={themeColor} />
          <WeatherWidgetViaCopilot />
        </div>
        <div
          className=""
          style={
            {
              "--copilot-kit-background-color": "#E0E9FD",
              "--copilot-kit-secondary-color": "#6766FC",
              "--copilot-kit-separator-color": "#b8b8b8",
              "--copilot-kit-primary-color": "#FFFFFF",
              "--copilot-kit-contrast-color": "#000000",
              "--copilot-kit-secondary-contrast-color": "#000",
            } as CopilotKitCSSProperties
          }
        >
          <CopilotSidebar
            className=""
            onSubmitMessage={async (message) => {
              setState({ ...state, logs: [] });
              await new Promise((resolve) => setTimeout(resolve, 30));
            }}
            labels={{
              title: "Research and Plan AI",
              initial: "Hi! 👋 How can I assist you today?",
            }}
          />
        </div>
      </div>
    </>
  );
}
