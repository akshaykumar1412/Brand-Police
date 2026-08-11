# Brand Police frontend

Brand Police is a customer-facing Brandy workflow for detecting, reviewing, and resolving potentially incorrect or unauthorized brand use.

## Prototype coverage

- Brandy customer product shell with the 68px nav rail and curved workspace
- Overview with compliance health, trends, activity, and priority findings
- Findings with saved views, filtering, selection, and bulk actions
- Finding details with evidence, rule reasoning, assignment, comments, and resolution actions
- Manual and scheduled scans with scan history
- Pre-publish checks for images, PDFs, and presentations
- Monitored asset management connected to Brand Space
- Domain classification and compliance rule management
- Compliance reports and domain scorecards
- Monitoring, notification, and evidence retention settings
- Responsive Brandy product navigation using the current DM Sans type system
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
