# Concierge Itinerary Proposal System

Full-stack assessment project — Exclusive Resorts.

## Stack

- **Next.js 16.2.9** (App Router, React 19)
- **Prisma 7 + SQLite** via `@prisma/adapter-better-sqlite3`
- **Tailwind CSS v4** + shadcn/ui
- **Zod v4** for API and form validation
- **Zustand v5** for client draft state
- **react-hook-form v7** for form handling
- **TypeScript** throughout

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'APP_URL="http://localhost:3000"' >> .env

# 3. Run migrations and seed
npx prisma migrate dev
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the concierge dashboard.
The member view is at `/proposal/[id]` — the link appears in the proposal history sidebar after sending.

---

## Project structure

```
app/
  page.tsx                          # Concierge dashboard (server component)
  proposal/[id]/page.tsx            # Member proposal view (server component)
  api/                              # Thin Next.js route stubs — one-line re-exports only

modules/
  concierge/                        # Concierge domain
    api/                            # Route handler implementations
    api.ts                          # Client-side fetch helpers
    api.server.ts                   # Server-side fetch helpers (uses env for absolute URLs)
    components/
      proposal-builder/             # Category selector, item form, items list, preview dialog
      dashboard.tsx                 # Orchestrates the concierge workflow
      proposals-list.tsx            # Sidebar history of sent proposals
      trip-header.tsx               # Top bar with member + reservation info
    constants.ts                    # CATEGORIES, Category type
    schemas.ts                      # API-facing Zod schemas (CreateProposalSchema, etc.)
    form-schemas.ts                 # Form-facing Zod schemas (ItemFormSchema)
    store/proposal-store.ts         # Zustand store for draft state
    types.ts                        # Serialisable types for server → client
    email.ts                        # Email body builder

  member/                           # Member domain
    api/                            # Route handler implementations
    api.ts                          # Client-side fetch helpers
    api.server.ts                   # Server-side fetch helpers
    components/
      proposal-view.tsx             # Layout shell
      proposal-header.tsx           # Villa / dates / member header
      itinerary-timeline.tsx        # Items grouped by day
      approve-pay-panel.tsx         # Status transition UI (sent → approved → paid)
    schemas.ts                      # UpdateProposalStatusSchema
    transitions.ts                  # VALID_TRANSITIONS map + isValidTransition()
    types.ts                        # ProposalDetailData, ProposalItem
    utils.ts                        # Formatting and groupByDay helpers

__tests__/
  concierge/
    schemas.test.ts                 # CreateProposalSchema, ProposalItemSchema, ProposalStatus
    form-schemas.test.ts            # ItemFormSchema
    email.test.ts                   # buildProposalEmailBody, sendEmail
  member/
    schemas.test.ts                 # UpdateProposalStatusSchema
    transitions.test.ts             # isValidTransition state machine
    utils.test.ts                   # groupByDay, formatCurrency, formatDate, formatDateTime
  api/
    reservations.test.ts            # GET /api/reservations
    proposals.test.ts               # GET + POST /api/proposals
    proposals-id.test.ts            # GET /api/proposals/[id]
    proposals-id-send.test.ts       # POST /api/proposals/[id]/send
    proposals-id-patch.test.ts      # PATCH /api/proposals/[id]
```

The `app/api/` files are intentionally minimal — each is a one-line re-export pointing to the real handler in the relevant module. This keeps Next.js routing wiring separate from domain logic.

---

## Testing

```bash
npm test          # run all tests once
npm run test:ui   # open Vitest browser UI
```

**79 tests across 11 files — no external services, no database required.**

Tests are split into two layers:

**Unit tests** (`__tests__/concierge/`, `__tests__/member/`) cover pure logic in isolation: Zod schemas (valid inputs, invalid inputs, edge cases), `isValidTransition` state machine, and utility functions (`formatCurrency`, `groupByDay`, etc.).

**Route handler tests** (`__tests__/api/`) cover every API endpoint. Prisma is replaced with Vitest mocks (`vi.mock('@/lib/db', ...)`), so tests run in milliseconds without a real database. Each handler is exercised for:
- Happy path (correct status code + response shape)
- Validation failures (400)
- Not-found cases (404)
- Business rule violations (409, 422)
- Concurrent modification (the `updateMany` count check)
- Unexpected DB errors (500)

The `$transaction` mock pattern used in the send handler tests:
```ts
$transaction: vi.fn((fn) => fn(mockTx))
```
This lets the callback run synchronously against a controlled `mockTx` object without requiring an actual SQLite transaction.

---

## Architecture decisions

### Module boundaries mirror domain boundaries

Two modules: `concierge` (staff-facing) and `member` (guest-facing). Each owns its API handlers, types, schemas, and fetch helpers. The only cross-module dependency is `MemberData` and `ProposalStatus`, which are exported from `concierge/types` since the concierge module is the authority on those shared primitives.

### Schema split: API vs form

`concierge/schemas.ts` contains Zod schemas for API validation — strict, ISO datetime strings, `z.number().positive()`. `concierge/form-schemas.ts` contains form schemas — `scheduledAt` as a plain string (the input emits local datetime format, not ISO), `description` optional. They intentionally diverge because the form has UX constraints the API doesn't care about.

### Status transitions as explicit data

```ts
const VALID_TRANSITIONS: Record<string, string[]> = {
  sent: ['approved'],
  approved: ['paid'],
}
```

The allowed state machine is declared in one place (`member/transitions.ts`) and imported by both the PATCH handler and the test suite. Adding a new status (e.g. `rejected`) means adding one entry here rather than hunting for conditionals.

### Proposals embedded in reservation response

`GET /api/reservations` returns the reservation with proposals included. This halves the number of round trips on initial page load. The tradeoff is that refreshing the proposal list (after sending) re-fetches the full reservation — acceptable for this scale, and `router.refresh()` in Next.js triggers a server re-render which keeps it consistent.

### Email simulation

Rather than a no-op, the send flow writes a `SentEmail` row to the database with the full email body preview and logs it to stdout. This proves the workflow is wired correctly and leaves an audit trail. Swapping in a real provider (Resend, SendGrid) requires only updating `POST /api/proposals/[id]/send`.

### Two-step create + send (known tradeoff)

The spec defines `POST /api/proposals` (create draft) and `POST /api/proposals/[id]/send` as separate routes, which fits a workflow where drafts can be saved and sent later. In the current UI the concierge always sends immediately, so the client makes two sequential calls. This introduces a failure window: if create succeeds and send fails, an orphaned draft is left in the database.

The correct production approach is event-driven: `POST /api/proposals` emits a `ProposalCreated` event; a worker listens and triggers the send flow with automatic retries — the client never calls send directly and the failure surface disappears. For this scope, the two-call approach is acceptable; it would be the first thing to address before going to production.

---

## Assumptions

- **Single active reservation.** The concierge dashboard shows the first upcoming reservation. The assessment describes a single scenario (James Whitfield, Villa Punta Mita), so no session or auth context is needed.
- **No authentication.** Both the concierge dashboard and the member proposal URL are publicly accessible. In production, the concierge portal would sit behind SSO and the proposal link would be a signed/expiring token.
- **SQLite is sufficient.** The assessment specifies it. The Prisma adapter layer means swapping to Postgres requires only changing the datasource provider and connection string.
- **No real payment.** The "Pay & Lock In" button transitions status to `paid`. The assessment explicitly calls this out as acceptable.
- **Price is stored as `Float`.** For real money, `Decimal` or integer cents would be more appropriate. `Float` is fine for demo purposes.

---

## What I would improve given more time

- **Authentication.** Concierge portal behind an auth provider (NextAuth, Clerk). Member proposal links as signed JWTs with expiry so only the right person can approve.
- **React Query.** Client mutations (`handleSend`, approve, pay) currently use `useState` + `fetch` + `router.refresh()`. TanStack Query's `useMutation` would handle loading/error/invalidation more cleanly as the app grows.
- **Edit draft before sending.** Currently once items are added to a draft, the only action is send. A draft editor would let the concierge save progress and return later.
- **Real email delivery.** Drop-in with Resend — the `buildProposalEmailBody` helper already produces the email body; the send handler just needs a `resend.emails.send()` call.
- **Optimistic UI.** The approve/pay transitions update local state immediately but wait for `router.refresh()` for the server-side list to update. A proper optimistic update with rollback on failure would feel faster.
- **Proper enums in Prisma.** `Proposal.status` is a `String` because SQLite has no native enum type. With Postgres, this becomes `enum ProposalStatus { draft sent approved paid }` with full DB-level constraint.
- **Error boundaries.** Client components have local error state but there are no React error boundaries to catch unexpected render errors.
- **Rate limiting.** The API routes have no rate limiting. In production, the PATCH and send endpoints would need protection against abuse.

---
