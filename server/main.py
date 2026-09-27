import resource
from fastmcp import FastMCP
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.requests import Request as StarletteRequest
from starlette.responses import JSONResponse
from fastmcp.server.auth.providers.jwt import JWTVerifier
from fastmcp.server.dependencies import get_access_token, AccessToken
import os


load_dotenv()

STYTCH_DOMAIN = os.getenv("STYTCH_DOMAIN")
STYTCH_PROJECT_ID = os.getenv("STYTCH_PROJECT_ID")

auth = JWTVerifier(
    jwks_uri=f"{STYTCH_DOMAIN}/well-known/jwks.json",
    issuer=STYTCH_DOMAIN,
    audience=STYTCH_PROJECT_ID,
    algorithm="RS256",
)

mcp = FastMCP(name="MCP Application", version="1.0.0", auth=auth)

@mcp.tool()
def get_weather(_ctx, city: str) -> str:
    """Get the weather for a given city"""
    return f"The weather in {city} is sunny"

@mcp.tool()
def get_news(_ctx, topic: str) -> str:
    #Get the news for a given topic
    return f"The news about {topic} is that it is a good day"

@mcp.tool()
def get_stock_price(_ctx, stock: str) -> str:
    #Get the stock price for a given stock
    return f"The stock price of {stock} is 100"

@mcp.custom_route("/.well-known/oauth-protected-resource", methods=["GET", "OPTIONS"])
def oauth_metadata(request: StarletteRequest):
    base_url = str(request.base_url).rstrip("/")

    return JSONResponse({
        "resource": base_url,
        "authorization_servers": [os.getenv("STYTCH_DOMAIN")],
        "scopes_supported": ["read", "write"],
        "bearer_methods_supported": ["body", "header"],
    })



if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000,
    middleware=[Middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]),
    ])