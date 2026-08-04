# @pipeworx/mast-nasa

[MAST](https://mast.stsci.edu) — Mikulski Archive for Space Telescopes (STScI) MCP — Hubble, JWST, Pan-STARRS, GALEX, K2/Kepler, TESS data. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `cone_search(ra, dec, radius_arcmin, mission?, limit?)` — search MAST around a point
- `mission_search(mission, criteria, limit?)` — search by mission with criteria object
- `caom(query)` — generic CAOM (Common Archive Observation Model) query
- `lookup_name(name)` — resolve target name → coords + observations

## Data source

`https://mast.stsci.edu/api/v0/` (legacy POST-based JSON API).

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
