# Backend Implementation Plan

## Goal
Transition the Hospital Referral System from a mock-data frontend to a fully functional full-stack application using Next.js Server Actions/Route Handlers, Prisma, and a relational database.

## User Review Required
> [!IMPORTANT]
> **Database Choice**: We will use **SQLite** for local development simplicity (file-based, no extra server needed) which is fully supported by Prisma. It can be easily switched to PostgreSQL for production.
> **Auth Strategy**: We will implement a custom session-based auth using HTTP-only cookies for simplicity and control, replacing the current mock `AuthContext` logic.

## Proposed Changes

### Phase 1: Foundation & Auth
#### [NEW] `prisma/schema.prisma`
- Define the full schema based on `api_schema_rules.md`.
- Run `npx prisma migrate dev` to create the database.

#### [NEW] `prisma/seed.ts`
- Create a seed script to populate the database with the existing mock data (Users, Hospitals, Patients) so we don't start empty.

#### [MODIFY] `lib/auth.ts` (New File)
- Implement session management (JWT or simple session ID).
- Helper functions: `getCurrentUser`, `login`, `logout`.

#### [MODIFY] `app/api/auth/[...nextauth]/route.ts` (or similar)
- Implement API routes for login/logout.

#### [MODIFY] `context/auth-context.tsx`
- Refactor to call the real API endpoints instead of setting local state directly.

### Phase 2: Core Data (Patients & Hospitals)
#### [NEW] `app/actions/patients.ts`
- Server Actions for: `getPatients`, `getPatientById`, `createPatient`, `updatePatient`.

#### [NEW] `app/actions/hospitals.ts`
- Server Actions for: `getHospitals`.

#### [MODIFY] `app/(dashboard)/patients/page.tsx` & `[id]/page.tsx`
- Replace mock data imports with `getPatients` / `getPatientById` calls.

### Phase 3: Referral System (The Core)
#### [NEW] `app/actions/referrals.ts`
- `createReferral`: Handles wizard submission, validation, and emergency logic.
- `getReferrals`: Supports filtering by inbox/sent, status, priority.
- `getReferralById`: Fetches details + timeline.
- `updateReferralStatus`: Handles Accept/Reject transitions and logs events.

#### [MODIFY] `app/(dashboard)/referrals/page.tsx`
- Fetch real data using `getReferrals`.
- Implement server-side filtering/sorting if needed, or keep client-side for now (server-side recommended for scale).

#### [MODIFY] `app/(dashboard)/referrals/create/page.tsx`
- Wire up the wizard `handleSubmit` to call `createReferral`.

#### [MODIFY] `app/(dashboard)/referrals/[id]/page.tsx`
- Wire up Accept/Reject buttons to `updateReferralStatus`.

### Phase 4: Nurse Workflow & Tasks
#### [NEW] `app/actions/nurse.ts`
- `updateVitals`, `addNursingNote`, `flagConcern`.

#### [NEW] `app/actions/tasks.ts`
- `getTasks`, `updateTaskStatus`.

#### [MODIFY] `app/(dashboard)/tasks/page.tsx`
- Connect to real task data.

### Phase 5: Analytics & Admin
#### [NEW] `app/actions/analytics.ts`
- Complex aggregation queries for the dashboard charts.

#### [MODIFY] `app/(dashboard)/admin/analytics/page.tsx`
- Fetch real metrics.

## Verification Plan

### Automated Tests
- **Unit Tests**: We can add Jest/Vitest to test the Server Actions in isolation (mocking Prisma).
- **E2E Tests**: Use Playwright to simulate a full referral flow:
    1.  Login as Doctor A.
    2.  Create Emergency Referral.
    3.  Login as Doctor B (Receiving).
    4.  Verify Referral appears at top of inbox.
    5.  Accept Referral.
    6.  Verify status update.

### Manual Verification
1.  **Auth**: Login with different roles (Doctor, Nurse, Admin) and verify sidebar/access.
2.  **Data Persistence**: Restart the server and verify data remains (proving DB connection).
3.  **Cross-User Interaction**:
    *   User A sends referral.
    *   User B sees it.
    *   User B accepts it.
    *   User A sees it as accepted.
