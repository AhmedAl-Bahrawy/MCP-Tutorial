from fastmcp import FastMCP
from fastmcp.server.context import Context
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.requests import Request as StarletteRequest
from starlette.responses import JSONResponse
from fastmcp.server.auth.providers.jwt import JWTVerifier
import os


load_dotenv()

STYTCH_DOMAIN = os.getenv("STYTCH_DOMAIN")
STYTCH_PROJECT_ID = os.getenv("STYTCH_PROJECT_ID")
PUBLIC_URL = os.getenv("PUBLIC_URL", "http://127.0.0.1:8000").rstrip("/")

auth = JWTVerifier(
    jwks_uri=f"{STYTCH_DOMAIN}/.well-known/jwks.json",
    issuer=STYTCH_DOMAIN,
    audience=STYTCH_PROJECT_ID,
    algorithm="RS256",
    # Makes the 401 challenge advertise the Protected Resource Metadata URL
    # (RFC 9728 section 5.1) instead of a bare "Bearer".

)

mcp = FastMCP(name="MCP Application", version="1.0.0", auth=auth)

@mcp.tool()
def get_weather(ctx: Context, city: str) -> str:
    """Get the weather for a given city"""
    return f"The weather in {city} is sunny"

@mcp.tool()
def get_news(ctx: Context, topic: str) -> str:
    #Get the news for a given topic
    return f"The news about {topic} is that it is a good day"

@mcp.tool()
def get_stock_price(ctx: Context, stock: str) -> str:
    #Get the stock price for a given stock
    return f"The stock price of {stock} is 100"


def protected_resource_metadata(request: StarletteRequest) -> JSONResponse:
    base_url = str(request.base_url).rstrip("/")

    return JSONResponse({
        "resource": base_url,
        "authorization_servers": [STYTCH_DOMAIN],
        "scopes_supported": ["openid", "email", "profile"],
        "bearer_methods_supported": ["body", "header"],
    })


# Clients resolve the PRM URL advertised in the WWW-Authenticate challenge first, which
# is the path-inserted form (RFC 9728 section 3.1). Serve both that URL and the root one.
@mcp.custom_route("/.well-known/oauth-protected-resource", methods=["GET", "OPTIONS"])
def oauth_metadata(request: StarletteRequest):
    return protected_resource_metadata(request)


@mcp.custom_route(
    "/.well-known/oauth-protected-resource/{resource_path:path}",
    methods=["GET", "OPTIONS"],
)
def oauth_metadata_for_path(request: StarletteRequest):
    return protected_resource_metadata(request)


if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000,
    middleware=[Middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]),
    ])