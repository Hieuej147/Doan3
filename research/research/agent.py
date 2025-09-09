"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
import json
import os
from typing import cast

from langchain_core.messages import AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from research.state import AgentState
from research.downreso import download_node
from research.chat import chat_node
from research.search import search_node
from research.delete import delete_node, perform_delete_node
from research.search_weather import weather_node
# from research.background import change_background

# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("download", download_node)
workflow.add_node("chat_node", chat_node)
# workflow.add_node("weather_node",weather_node)
# workflow.add_node("change_background",change_background)
workflow.add_node("search_node", search_node)
workflow.add_node("delete_node", delete_node)
workflow.add_node("perform_delete_node", perform_delete_node)


workflow.set_entry_point("download")
workflow.add_edge("download", "chat_node")
# workflow.add_edge("weather_node","chat_node")
# workflow.add_edge("change_background","chat_node")
workflow.add_edge("delete_node", "perform_delete_node")
workflow.add_edge("perform_delete_node", "chat_node")
workflow.add_edge("search_node", "download")

# Conditionally use a checkpointer based on the environment
# This allows compatibility with both LangGraph API and CopilotKit
compile_kwargs = {"interrupt_after": ["delete_node"]}

# Check if we're running in LangGraph API mode
if os.environ.get("LANGGRAPH_API", "false").lower() == "true":
    # When running in LangGraph API, don't use a custom checkpointer
    graph = workflow.compile(**compile_kwargs) # type: ignore
else:
    # For CopilotKit and other contexts, use MemorySaver
    from langgraph.checkpoint.memory import MemorySaver
    memory = MemorySaver()
    compile_kwargs["checkpointer"] = memory  # type: ignore
    graph = workflow.compile(**compile_kwargs) # type: ignore
