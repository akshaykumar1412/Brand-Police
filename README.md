# Brand Consciousness AI frontend

Brand Consciousness AI brings Brandy's five AI agents into one connected product. Each agent uses the customer's Brand Space as shared context, so users can move from brand creation to everyday governance without uploading the same source material again.

## Prototype coverage

- A main Brand Consciousness AI page showing the five agents as one system
- Brand Architect for discovering brand assets from a website and structuring Brand Space
- Brand Coach for finding gaps, improving brand quality, and creating recommended tasks
- Chief Brand Officer for governance reviews, leadership metrics, and AI brand briefs
- Brand Police for continuous compliance monitoring, findings, evidence, reports, and resolution
- Brandy Support Agent for contextual product help based on the user's current workflow
- Shared system activity and an Architect to Coach to CBO to Police journey
- Responsive Brandy navigation using the current DM Sans type system
- Realistic interactive demo data with no paid AI or scanning calls

## Run locally

```bash
npm install
npm run dev
```

## Data model and demo mode

The intended production flow reads brand data from Brandy's Brand Space. Users do not upload source files into this interface. In the prototype, agent actions and Brand Police scans are simulated. Without `NEXT_PUBLIC_BRAND_POLICE_API_URL`, findings and review decisions use local demo data.

## Brand Police backend contract

Set `NEXT_PUBLIC_BRAND_POLICE_API_URL` to connect the production service. The frontend currently expects:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/findings` | List tenant-scoped findings |
| `PATCH` | `/findings/:id` | Update status, owner, or finding metadata |
| `POST` | `/scans` | Queue a scan using target and asset selections |

Authentication, tenancy, scheduling, provider credentials, evidence storage, audit logs, rate limits, and deduplication must remain server-side.

The other four agent experiences are currently frontend prototypes. Their production APIs should follow the same tenant-scoped, server-side model and use Brand Space as the shared source of truth.

## EC2 deployment

The app builds as a static Next.js export in `out/`. It can be served from EC2 with Nginx or another static web server. Configure `NEXT_PUBLIC_BRAND_POLICE_API_URL` at build time when the production API is ready, and serve the API over HTTPS with the correct CORS policy.

## Build

```bash
npm run build
```

The static output is generated in `out/`.
