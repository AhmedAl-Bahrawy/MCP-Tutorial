from fastmcp import FastMCP
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware

load_dotenv()

mcp = FastMCP(name="MCP Application", version="1.0.0")

@mcp.tool()
def get_weather(city: str) -> str:
    """Get the weather for a given city"""
    return f"The weather in {city} is sunny"

@mcp.tool()
def get_news(topic: str) -> str:
    #Get the news for a given topic
    return f"The news about {topic} is that it is a good day"

@mcp.tool()
def get_stock_price(stock: str) -> str:
    #Get the stock price for a given stock
    return f"The stock price of {stock} is 100"


if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000,
    middleware=[Middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]),
    ])