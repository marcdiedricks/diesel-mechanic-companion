# DIESEL_MECHANIC_EXISTING_ASSET_AUDIT.md

Status: ACTIVE
Audit date: 2026-09-21

## EXISTING REPOSITORY

Repository: marcdiedricks/diesel-mechanic-companion

Existing architecture:
- Replit/Vite/React/TypeScript application.
- Local-first PWA manifest and service worker.
- Multilingual EN/AF/XH/ZU interface elements.
- Workshop-themed learner UI.
- Existing trade calculators and diagnostic/reference content.
- Existing curriculum/video resource area.
- No completed KM/PM/WM curriculum architecture comparable to frozen Boilermaker 0.3C.

## CRITICAL FINDINGS

1. QUALIFICATION ID ERROR — HIGH PRIORITY
The current UI identifies Diesel Mechanic as SAQA ID 96449. That is incorrect. SAQA ID 96449 is a Bachelor of Business Administration in Retail Management.

2. CURRENT DIESEL QUALIFICATION MAPPING
The controlled mapping for this build is SAQA 117237, Occupational Certificate: Diesel Mechanic, curriculum 653306-000-01-00, NQF 4, 544 credits.

3. TRANSITION STATUS
SAQA 117237 has passed its registration end date and its last enrolment date has passed. SAQA 97592 remains visible in the SAQA system with a later last-enrolment date but is explicitly marked as replaced by 117237. This creates a transition anomaly that must remain visible in governance and not be silently normalised.

4. SAFETY CONTENT RESET REQUIRED
The existing app contains operationally specific high-risk vehicle content and workshop calculations. These cannot remain learner-facing in their present form. High-risk material will be converted to theory, hazard recognition, conceptual diagnostics, documentation and supervised-evidence support.

5. VIDEO RESOURCE RESET REQUIRED
The existing app uses generic YouTube search links, including topics that can lead directly to hazardous operational tutorials. These are not accepted under the Mzansi visual-learning governance model. A controlled visual library will replace them.

6. REUSE DECISION
Preserve:
- overall PWA shell;
- multilingual navigation pattern;
- workshop visual identity;
- offline-first foundation;
- deterministic low-risk educational calculations where safe after review.

Retire/rebuild:
- incorrect SAQA identification;
- unsafe operational safety text;
- generic hazardous video searches;
- unsupported fixed diagnostic thresholds presented as universal;
- any calculator/result wording that could be used to perform hazardous repair or lifting work;
- current informal 10-unit curriculum resource model.

## NEXT BUILD ORDER

1. Qualification/safety reset.
2. Build curriculum control surface for KM-01 to KM-08.
3. Complete KM content and learning checks.
4. Build PM-01 to PM-18 as preparation/evidence support.
5. Build WM-01 to WM-14 as workplace evidence support.
6. Add controlled visual-learning library.
7. Source/standards audit.
8. Offline/mobile acceptance.
9. Readiness score and freeze.
