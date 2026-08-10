# Brand Police frontend

Production-quality Brand Police interface for Brandy. It runs as a static Next.js application today and switches to the real backend later without changing the UI.

## Run locally

```bash
npm install
npm run dev
```

## Current demo mode

When `NEXT_PUBLIC_BRAND_POLICE_API_URL` is not set, the app uses realistic seeded data and keeps review decisions in `localStorage`. Scans are simulated. No credentials, database, or paid scanning API are required.

## Connect the production backend

Set:

```bash
NEXT_PUBLIC_BRAND_POLICE_API_URL=https://api.example.com/brand-police
```

The frontend expects authenticated, tenant-scoped endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/findings` | Return `{ findings: Finding[] }` |
| `PATCH` | `/findings/:id` | Accept `{ status }` and return the updated finding |
| `POST` | `/scans` | Start a scan and return `{ scanned, newFindings, completedAt }` |

Authentication should use the existing Brandy session cookie. The server must enforce workspace and Brand Space access. Never trust a workspace or Brand Space ID supplied only by the client.

## Production backend requirements

- Queue scans outside the request lifecycle
- Scope every finding and scan to workspace and Brand Space IDs
- Rate limit scan creation
- Deduplicate by Brand Space, source URL, matched asset, and scan window
- Maintain approved-domain and approved-use records
- Store scan history and first-seen/last-seen timestamps
- Keep Google Vision or other provider credentials server-side
- Send alerts only for newly discovered findings
- Record review actions in an audit log
- Use provider match terminology instead of presenting it as compliance certainty

## Build

```bash
npm run build
```

The static output is generated in `out/`.
