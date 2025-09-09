from typing import Annotated, List, Optional, Literal, Union, TypedDict
from pydantic import BaseModel, Field
from langgraph.graph import MessagesState
from dotenv import load_dotenv
# from langchain_nvidia_ai_endpoints import ChatNVIDIA
from copilotkit import CopilotKitState
# from copilotkit.langgraph import CopilotKitState
load_dotenv()

"""
This is the state definition for the AI.
It defines the state of the agent and the state of the conversation.
"""
class Resource(TypedDict):
    """
    Represents a resource. Give it a good title and a short description.
    """
    url: str
    title: str
    description: str
    

class Log(TypedDict):
    """
    Represents a log of an action performed by the agent.
    """
    message: str
    done: bool

class AgentState(CopilotKitState):
    """
    This is the state of the agent.
    It is a subclass of the MessagesState class from langgraph.
    """
    model: str
    research_question: str
    report: str
    resources: List[Resource]
    logs: List[Log]
    weather: str
    background: str






