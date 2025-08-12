# Copilot Agent Playbook — REALIGN (NorthPath App)

## What "DONE" means
- Stripe checkout → webhook assigns tier → user lands with correct access (middleware gates `/enterprise/dashboard`, `/scenario/[id]`).
- Welcome + onboarding email with link to `/assessment/onboarding`.
- Users can: upload files `/api/upload`, generate AI PDF `/api/report/generate`, run One‑Click Org Chart (API + `/demo/org-chart`), and create/run Scenario + ROI.
- Power BI loads for enterprise on `app.northpathstrategies.org`.
- Vercel build is green (applied enterprise dashboard SSR fix).

## Step A — Fix known build blocker (enterprise dashboard)
- Edit `app/enterprise/dashboard/page.tsx`:
  - Ensure `"use client"` is present.
  - Remove any SSR redirect logic using `useSession()`; handle `status === "loading"` client‑side (render a loading component).
  - If still needed, set `export const dynamic = "force-dynamic"` on a separate loading file as per prod notes.
- Verify: `pnpm build` passes locally.

## Step B — Create/update environment template
Create `.env.production.template` with these keys (fill later):

```
NEXT_PUBLIC_DOMAIN=app.northpathstrategies.org
NEXT_PUBLIC_APP_URL=https://app.northpathstrategies.org
NEXTAUTH_URL=https://app.northpathstrategies.org
NEXTAUTH_SECRET=<GENERATE>
DATABASE_URL=<RAILWAY_POSTGRES>
OPENAI_API_KEY=<OPENAI>
STRIPE_SECRET_KEY=<STRIPE_SK>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<STRIPE_PK>
STRIPE_WEBHOOK_SECRET=<TO_BE_SET_AFTER_WEBHOOK_CREATED>
STRIPE_BASIC_PRICE_ID=<price_...>          # One-Time Diagnostic
STRIPE_TEAM_PRICE_ID=<price_...>           # Monthly
STRIPE_COMPREHENSIVE_PRICE_ID=<price_...>  # Comprehensive
STRIPE_ENTERPRISE_PRICE_ID=<price_...>     # Enterprise
POWERBI_CLIENT_ID=<AAD_APP_ID>
POWERBI_CLIENT_SECRET=<AAD_APP_SECRET>
POWERBI_TENANT_ID=<AAD_TENANT_ID>
POWERBI_WORKSPACE_ID=<PBI_WORKSPACE_ID>
POWERBI_REPORT_ID=<PBI_REPORT_ID>
NEXT_PUBLIC_POWERBI_EMBED_URL=https://app.powerbi.com/reportEmbed
EMAIL_PROVIDER=RESEND|SENDGRID|SES|SMTP
RESEND_API_KEY=<optional>
SENDGRID_API_KEY=<optional>
SMTP_HOST=<optional>
SMTP_PORT=<optional>
SMTP_USER=<optional>
SMTP_PASS=<optional>
FROM_EMAIL=no-reply@northpathstrategies.org
```

**ASK THE USER NOW (exact prompts):**
1) “Paste values for: NEXTAUTH_SECRET, OPENAI_API_KEY, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.”
2) “Choose email provider (RESEND/SENDGRID/SES/SMTP) and paste needed keys.”
3) “Do you want Power BI now? If yes, paste AAD app (CLIENT_ID/SECRET), TENANT_ID, WORKSPACE_ID, REPORT_ID. If ‘skip’, I’ll stub and continue.”

## Step C — Railway Postgres
```
railway init --name realign-prod
railway add postgresql
railway variables set NODE_ENV=production
```
- Fetch `DATABASE_URL`, write it to local `.env` and Vercel env later.
- Run Prisma:
```
pnpm prisma generate
pnpm prisma migrate deploy
```
If a DB auth/tenant error surfaces, prompt to re‑create DATABASE_URL, then rerun migrate (see scenario engine note).

## Step D — Vercel project + domain
```
vercel link
```
(create or link project)
- Add envs to Vercel (`vercel env add ...` or via UI).
- Deploy:
```
vercel --prod
```
- Add domain: `app.northpathstrategies.org`. Print DNS CNAME target for user to update.

## Step E — Stripe products, prices, webhook, mapping
Create 4 (test‑mode) products + prices:
- One‑Time Diagnostic — $4,995
- Monthly Subscription — $2,995/mo
- Comprehensive Package — $9,900
- Enterprise Transformation — $24,000 (+ per‑module add‑ons optional)

Paste resulting `price_...` IDs into env (`STRIPE_*_PRICE_ID`).

Start webhook to deployed webhook route (or local when testing):
```
stripe listen --forward-to https://<vercel-deploy>/api/stripe/webhook
```
Confirm webhook handler updates user tier and creates assessment records.
Confirm success redirect goes to `/assessment/start?tier=...` (or success page).

## Step F — Email service wiring
- Create `lib/email.ts` with `sendEmail(to, subject, html)` that switches on `EMAIL_PROVIDER`.
- In `/app/api/stripe/webhook/route.ts`, after tier assignment, call `sendEmail` with:
  - Subject: “Welcome to NorthPath — Next steps inside”
  - Body: a button linking to `${NEXT_PUBLIC_APP_URL}/assessment/onboarding`.
- For enterprise tier, include a link “Power BI setup steps” (we’ll add a page below).

## Step G — Power BI setup (enterprise only)
- Confirm `PowerBIEmbed` uses `POWERBI_*` env and `allowedHosts: ["app.northpathstrategies.org"]`.
- Add an internal page `/enterprise/powerbi-setup` containing the admin checklist from your guide (tenant settings, service principal, redirect URIs).
- Ensure `/enterprise/dashboard` remains tier‑gated via middleware.

## Step H — Feature smoke tests (script + curl)
1) Onboarding page: Visit `/assessment/onboarding` and verify tier‑specific checklist & templates.
2) Uploads:
```
curl -F "file=@./samples/positions.csv" https://<domain>/api/upload
```
Should map columns to tables per spec.
3) AI PDF:
```
curl -X POST https://<domain>/api/report/generate \
  -H "Content-Type: application/json" \
  -d '{"answers":{"organizationalStructure":"Traditional hierarchy"},"scores":{"organizationalHealth":7.2,"overallScore":6.5},"options":{"includeRecommendations":true,"includeCharts":true,"organizationName":"Demo Org","reportTitle":"Assessment Report"}}' \
  --output report.pdf
```
Should get a PDF.
4) Org Chart:
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"assessmentId":"test","orgUnits":[{"id":"ceo","roleTitle":"CEO","fte":1}]}' \
  https://<domain>/api/chart/generate
```
Then visit `/demo/org-chart` and verify interactive UI + exports.
5) Scenarios/ROI: open scenarios UI and run calculations (NPV/IRR/Monte Carlo).
6) Enterprise dashboard: login as enterprise user → `/enterprise/dashboard` should load (or show a friendly PBI‑setup stub).

## Tier gating sanity check
- Middleware checks `session.tier` for `/enterprise/dashboard` and `/scenario/[id]`.
- Ensure NextAuth JWT includes updated `tier` after webhook; refresh session to see it.

## Troubleshooting quick list
- Webhook not updating tier → verify `STRIPE_WEBHOOK_SECRET` and logs; ensure DB write ok.
- Blocked routes → JWT `tier` is missing; check NextAuth callbacks + middleware matrix.
- Power BI blocked → whitelist domain; configure AAD & service principal; set envs.
- AI PDF failure → set `OPENAI_API_KEY`; body matches spec.
- Org Chart missing → use `/demo/org-chart`; it’s universal in all tiers.

## Pending / Verify
- Confirm any truncated instructions were restored (add if needed).
