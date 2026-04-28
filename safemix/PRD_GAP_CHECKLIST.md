# SafeMix PRD Gap Checklist (Section-wise)

This checklist maps PRD sections to current implementation status after commit `30b5182`.

## Section 8 - Fixed Information Architecture
- [x] User app tabs and major flows exist (dashboard, add medicine, reports, reminders, profile/settings).
- [x] Doctor portal modules 1-4 exist (scan, review, explanation, export/print).
- [x] Admin dashboard modules 1-6 exist as pages.
- [~] Analytics dashboard exists, but PRD district drilldown/time slider/CSV export depth is partial.

## Section 9 - Features Breakdown
- [x] Red/Yellow/Green verdict engine with explanation and suggestions.
- [x] QR doctor sharing + revocation model + snapshot ack flow.
- [x] Adverse-event reporting mapped to PvPI/AIIA fields.
- [x] Family profiles up to 6 with consent PIN.
- [~] AI assistant transparency strip and source footer are partial (citations exist in verdict path; assistant UX still basic).

## Section 10 - MVP Scope
- [x] Web MVP equivalent implemented with core interaction safety features.
- [~] PRD mandated Android-first UX constraints are partially represented in web layout; not native Android delivery.

## Section 11 - Future Scope
- [x] Multilingual scaffold beyond Hindi/English present.
- [~] 200+ published interaction dataset target not reached.
- [ ] ABDM/HIP-HIU production integration not implemented.
- [ ] Formal insurer/government pilot integrations not implemented in product code.

## Section 12 - Google Tech Architecture
- [x] Gemini + Firebase + Hosting/App Router + FCM usage implemented.
- [~] Vertex architecture represented with stubs/fallbacks.
- [ ] Cloud Run microservice split, BigQuery export jobs, and production GCP infra pipeline not yet implemented.

## Section 13 - AI Architecture
- [x] Two-stage model (rules first, AI fallback) implemented.
- [x] Model routing table (Flash-Lite/Flash/Pro) implemented.
- [x] Review queue gating on confidence floor implemented.
- [~] Vertex severity classifier endpoint is scaffolded, not production-calibrated.
- [~] RAG is monograph in-memory scaffold, not vector-search backed.

## Section 14 - Database Design
- [x] Firestore domain collections for users, reports, queue, snapshots, flags.
- [~] Interaction graph curation collections present; governance workflow started.
- [ ] BigQuery export datasets and scheduled materializations absent.

## Section 15 - User Roles & Permissions
- [x] Role-oriented UI surfaces exist.
- [~] Claims-aware backend guardrails are partial.
- [ ] Firestore Security Rules with explicit role predicates were missing (added now in this change as scaffold; needs deployment and claim issuer wiring).

## Section 16 - Functional Requirements
- [x] Core medication safety checks, reminders, sharing, ADR, family workflows implemented.
- [~] Some operational workflows (grievance tracking, formal escalations) need deeper lifecycle automation.

## Section 17 - Non-Functional Requirements
- [~] Basic performance and caching patterns exist.
- [ ] SLO-backed observability, load testing artifacts, and DR drills are not present.

## Section 18 - Security, Privacy, DPDP
- [x] Critical secret exposure issue fixed (server-only keys).
- [x] User data export + deletion UI and actions implemented.
- [~] DPDP operational controls (grievance register, legal retention proofs) still to complete.
- [~] Rules scaffold added now; App Check strict enforcement and cert artifacts pending.

## Section 20 - Metrics for Success
- [x] Analytics events expanded and admin analytics dashboard added.
- [~] Complete event taxonomy and all metric dimensions (state, age_band, device_class) are not fully enforced across all events.

## Section 22 - 30/60/90 Day Roadmap Alignment
- [x] Day 1-30 and 31-60 many product features completed in web form.
- [~] Day 61-90 targets partially complete (analytics panels delivered, but pilots/ABDM/government readiness still pending).

## Highest-priority technical next items after this patch
1. Wire custom claims issuance flow (`patient`, `caregiver`, `doctor`, `reviewer`, `admin`) and deploy `firestore.rules`.
2. Replace ABDM stubs with sandbox APIs (consent artifacts + FHIR R4 import/export).
3. Replace in-memory RAG with Vertex Vector Search + embeddings.
4. Add district drilldown + CSV export + time slider to analytics heatmap.
5. Add BigQuery export pipeline + scheduled aggregate jobs.
