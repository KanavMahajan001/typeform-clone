# Typeform Clone — Deliverables Checklist

Source: `docs/Assignment Typeform Clone.pdf` (Typeform Builder — SDE Fullstack Assignment)

**Goal:** A functional Typeform clone that matches Typeform's UI/UX look and feel. The two most important pieces are the **form builder** and the **polished, animated one-question-at-a-time respondent flow**.

**Estimated effort:** ~24 hours

---

## 1. Tech Stack (required)

- [x] Frontend: **Next.js (TypeScript)** in `frontend/`
- [x] Backend: **Python with FastAPI or Django** in `backend/`
- [x] Database: **SQLite**, with a schema I design myself
- [x] Public form fill needs **no auth** and works as a real, shareable link

---

## 2. Core Features (must have)

### 2.1 Form Builder
- [x] Create a form with a title and an ordered list of questions
- [x] Add, edit and delete questions
- [x] Reorder questions with drag-and-drop
- [x] Question types:
  - [x] Short text
  - [x] Long text
  - [x] Multiple choice
  - [x] Dropdown
  - [x] Email
  - [x] Number
  - [x] Yes/No
  - [x] Rating
- [x] Per-question settings: **required** toggle, **description/help text**
- [x] Live preview of the form

### 2.2 Form Management (CRUD)
- [x] List the creator's forms with **status** (draft/published) and **response count**
- [x] Create, rename, duplicate and delete forms
- [x] Publish and unpublish, generating a **shareable public link**
- [x] All form definitions persist in the DB

### 2.3 Respondent Flow (the Typeform experience)
- [x] One question at a time, full-screen
- [x] Smooth, animated transitions between questions
- [x] Keyboard navigation (Enter / arrow keys to advance)
- [x] Progress indicator
- [x] Validation on the **client and the server** (required, email format, number, etc.)
- [x] Submitting stores the response, then shows a **thank-you screen**
- [x] No login required to fill a published form

### 2.4 Results / Responses
- [x] Per-form responses view (table/list of submissions)
- [x] View one response in full
- [x] Basic summary stats per question (e.g. counts for choice questions)
- [x] All responses persist in the DB

### 2.5 Typeform Look & Feel
- [x] Conversational, one-at-a-time fill UI with transitions
- [x] Clean builder layout with live preview
- [x] Forms, modals and inline editing
- [x] Notifications / toasts
- [x] Settings placeholders (theme, thank-you screen)
- [x] Overall it feels like Typeform, not a generic multi-field form

---

## 3. Placeholder Sections ("Coming Soon" is enough)

- [x] Advanced logic jumps / branching (basic branching counts as a bonus)
- [x] Integrations / webhooks
- [x] Team collaboration & sharing
- [x] Payment / file-upload question types (file upload implemented; payment is a placeholder)
- [x] Auth simplified: assume a default logged-in creator (went further: real email + password signup/login with per-user workspaces; demo account seeded)

---

## 4. Bonus (optional)

- [x] Logic jumps / conditional branching
- [x] Custom themes (colors, fonts, background)
- [x] Export responses as CSV
- [x] Partial-response tracking / completion rate
- [x] File-upload question type
- [x] Dark mode

---

## 5. Data & Documentation Requirements

- [x] **Seed data:** a couple of published forms with mixed question types and some existing responses, so the app is usable right away
- [x] **Database schema:** my own design, with proper relationships (this is graded)
- [x] **README** includes:
  - [x] Setup instructions
  - [x] Tech stack used
  - [x] Architecture overview
  - [x] Database schema
  - [x] API overview
  - [x] Assumptions made
- [x] **Original work:** no code copied from existing repos (plagiarism means disqualification)

---

## 6. Final Deliverables & Submission

- [x] **Source code:** public GitHub repo containing `frontend/` and `backend/`
- [x] **Documentation:** README as described above
- [ ] **Demo:** hosted, working link (Vercel / Netlify / Render / Railway / any cloud)
- [ ] Submit **both** the GitHub repo link and the deployed app link before the deadline

---

## 7. Evaluation Criteria

| Criteria | What they look for |
|---|---|
| Functionality | All core features work, especially the builder and the one-question-at-a-time respondent flow |
| UI/UX | Visual similarity to Typeform's design and UX patterns |
| Database Design | Well-structured schema with proper relationships |
| Backend / API Design | Clean, sensible API design and architecture |
| Code Quality | Clean, readable, well-organized code |
| Code Modularity | Separation of concerns, reusable components |
| Code Understanding | Ability to explain the code in the evaluation interview |

> AI tools are allowed and encouraged, but I must understand every line I submit and be ready to explain my implementation decisions in the interview.
