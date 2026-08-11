# Brand Police frontend

Brand Police is a customer-facing Brandy workflow for detecting, reviewing, and resolving potentially incorrect or unauthorized brand use.

## Prototype coverage

- Overview with compliance health, trends, activity, and priority findings
- Findings with search, filtering, severity, ownership, and lifecycle status
- Finding details with evidence, rule reasoning, assignment, comments, and resolution actions
- New scan flow for domains, sitemaps, or individual URLs
- Brand Space asset selection
- Domains and compliance rule management
- Responsive Brandy product navigation
- Realistic demo data and local persistence

## Run locally

```bash
npm install
npm run dev
```

## Demo mode

Without `NEXT_PUBLIC_BRAND_POLICE_API_URL`, findings and review decisions use local demo data. Scans are simulated and no paid scanning API is called.

## Backend contract

Set `NEXT_PUBLIC_BRAND_POLICE_API_URL` to connect the production service. The frontend currently expects:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/findings` | List tenant-scoped findings |
| `PATCH` | `/findings/:id` | Update status, owner, or finding metadata |
| `POST` | `/scans` | Queue a scan using target and asset selections |

Authentication, tenancy, scheduling, provider credentials, evidence storage, audit logs, rate limits, and deduplication must remain server-side.

## Build

```bash
npm run build
```

The static output is generated in `out/`.
