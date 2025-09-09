import os
import json
import asyncio
import aiohttp
from typing import cast, List, Dict, Any, Literal,Optional
from pydantic import BaseModel, Field
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, ToolMessage, SystemMessage
from langchain.tools import tool
from tavily import TavilyClient, AsyncTavilyClient
from copilotkit.langgraph import copilotkit_emit_state, copilotkit_customize_config
from research.state import AgentState
from research.model import get_model
import os
import asyncio
# from langchain_groq import ChatGroq
from langchain.tools import tool
import json
# from duckduckgo_search import DDGS
from langchain_core.messages import AIMessage, ToolMessage, SystemMessage
# from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
load_dotenv()
from langchain_community.utilities.openweathermap import OpenWeatherMapAPIWrapper
import aiohttp
import os
weather = OpenWeatherMapAPIWrapper()



# class WeatherInput(BaseModel):
#     """Input for getting weather data"""
#     location: str = Field(description="The location to get weather for")


OPENWEATHER_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

async def getWeather(location: str) -> str:
    """Lấy thời tiết hiện tại của location từ OpenWeather API bằng aiohttp"""
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/weather"
            f"?q={location}&appid={OPENWEATHER_API_KEY}&units=metric&lang=vi"
        )
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                if resp.status != 200:
                    return f"Lỗi truy vấn API: {resp.status}"
                data = await resp.json()

        # Parse dữ liệu (ví dụ đơn giản)
        temp = data["main"]["temp"]
        description = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]
        return f"{location}: {description}, {temp}°C, độ ẩm: {humidity}%"

    except Exception as e:
        return f"Lỗi lấy thời tiết cho {location}: {str(e)}"

async def weather_node(state: AgentState, config: RunnableConfig):
    """
    Node to fetch weather information for a given location using OpenWeatherMap API.
    """
    # Lấy tin nhắn AI gần nhất
    ai_message = cast(AIMessage, state["messages"][-1])
    # Khởi tạo logs nếu chưa có
    state["logs"] = state.get("logs", [])
    state["weather"] = state.get("weather", "")
    # Lấy location từ tool_calls
    location = ai_message.tool_calls[0]["args"]["location"]

        # Kiểm tra tool_calls
    if not ai_message.tool_calls or len(ai_message.tool_calls) == 0:
        state["logs"].append({"message": "No valid tool calls found", "done": True})
        await copilotkit_emit_state(config, state)
        return state


    state["logs"].append({
        "message": f"Search for {location}",
        "done": False
    })
      
    await copilotkit_emit_state(config, state)


    try:
        result = await getWeather(location)  
        search_result = result
    except Exception as e:
        search_result = {"error": str(e)}
    state["logs"][-1]["done"] = True
    await copilotkit_emit_state(config, state)
        
    
    
    state["logs"] = []
    await copilotkit_emit_state(config, state)

    state["weather"] = search_result if isinstance(search_result, str) else json.dumps(search_result)  # Lưu kết quả thời tiết

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        content=f"Weather current in {location} and response deitail weather current {state['weather']}"
    ))

    return state
