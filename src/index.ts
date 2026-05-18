interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * MAST MCP — Space Telescopes archive.
 */


const BASE = 'https://mast.stsci.edu/api/v0';
const UA = 'pipeworx-mcp-mast-nasa/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'cone_search',
    description: 'Search MAST around (RA, Dec).',
    inputSchema: {
      type: 'object',
      properties: {
        ra: { type: 'number' },
        dec: { type: 'number' },
        radius_arcmin: { type: 'number', description: 'Default 1.0' },
        mission: { type: 'string', description: 'e.g. "HST", "JWST". Optional.' },
        limit: { type: 'number' },
      },
      required: ['ra', 'dec'],
    },
  },
  {
    name: 'mission_search',
    description: 'Mission-scoped search with arbitrary criteria.',
    inputSchema: {
      type: 'object',
      properties: {
        mission: { type: 'string', description: 'e.g. "HST", "JWST", "Pan-STARRS", "K2", "Kepler", "GALEX", "TESS"' },
        criteria: { type: 'object', description: 'Object of MAST filter columns → values.' },
        limit: { type: 'number' },
      },
      required: ['mission', 'criteria'],
    },
  },
  {
    name: 'caom',
    description: 'Generic CAOM (Common Archive Observation Model) query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'object', description: 'Raw MAST request body (service + params).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'lookup_name',
    description: 'Resolve target name → coords.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'cone_search': {
      const body = {
        service: 'Mast.Caom.Cone',
        params: {
          ra: args.ra,
          dec: args.dec,
          radius: ((args.radius_arcmin as number) ?? 1) / 60, // MAST expects degrees
        },
        format: 'json',
        pagesize: Math.min(5000, Math.max(1, (args.limit as number) ?? 100)),
        page: 1,
      };
      const result = await mastPost(body);
      if (args.mission && (result as any)?.data) {
        const filtered = (result as any).data.filter((r: any) => (r.obs_collection ?? '').toLowerCase() === String(args.mission).toLowerCase());
        return { ...(result as object), data: filtered };
      }
      return result;
    }
    case 'mission_search': {
      const body = {
        service: 'Mast.Caom.Filtered',
        format: 'json',
        params: {
          columns: '*',
          filters: Object.entries((args.criteria ?? {}) as Record<string, unknown>).map(([k, v]) => ({ paramName: k, values: Array.isArray(v) ? v : [v] })),
        },
        pagesize: Math.min(5000, Math.max(1, (args.limit as number) ?? 100)),
        page: 1,
      };
      return mastPost(body);
    }
    case 'caom':
      return mastPost(args.query);
    case 'lookup_name': {
      const body = { service: 'Mast.Name.Lookup', params: { input: reqStr(args, 'name', '"M31"'), format: 'json' }, format: 'json' };
      return mastPost(body);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function mastPost(body: unknown): Promise<unknown> {
  const res = await fetch(`${BASE}/invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', 'User-Agent': UA },
    body: new URLSearchParams({ request: JSON.stringify(body) }),
  });
  if (!res.ok) throw new Error(`MAST: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
