# mcp-mast-nasa

MAST MCP — Space Telescopes archive.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `cone_search` | Search MAST around (RA, Dec). |
| `mission_search` | Mission-scoped search with arbitrary criteria. |
| `caom` | Generic CAOM (Common Archive Observation Model) query. |
| `lookup_name` | Resolve target name → coords. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mast-nasa": {
      "url": "https://gateway.pipeworx.io/mast-nasa/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mast Nasa data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
