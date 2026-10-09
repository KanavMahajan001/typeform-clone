# Typeform Clone — Deliverables Checklist

Source: `docs/Assignment Typeform Clone.pdf` (Typeform Builder — SDE Fullstack Assignment)

**Goal:** A functional Typeform clone that matches Typeform's UI/UX look and feel. The two most important pieces are the **form builder** and the **polished, animated one-question-at-a-time respondent flow**.

**Estimated effort:** ~24 hours

---

## 1. Tech Stack (required)

- [ ] Frontend: **Next.js (TypeScript)** in `frontend/`
- [ ] Backend: **Python with FastAPI or Django** in `backend/`
- [ ] Database: **SQLite**, with a schema I design myself
- [ ] Public form fill needs **no auth** and works as a real, shareable link

---

## 2. Core Features (must have)

### 2.1 Form Builder
- [ ] Create a form with a title and an ordered list of questions
- [ ] Add, edit and delete questions
- [ ] Reorder questions with drag-and-drop
- [ ] Question types:
  - [ ] Short text
  - [ ] Long text
  - [ ] Multiple choice
  - [ ] Dropdown
  - [ ] Email
  - [ ] Number
  - [ ] Yes/No
  - [ ] Rating
- [ ] Per-question settings: **required** toggle, **description/help text**
- [ ] Live preview of the form

### 2.2 Form Management (CRUD)
- [ ] List the creator's forms with **status** (draft/published) and **response count**
- [ ] Create, rename, duplicate and delete forms
- [ ] Publish and unpublish, generating a **shareable public link**
- [ ] All form definitions persist in the DB

### 2.3 Respondent Flow (the Typeform experience)
- [ ] One question at a time, full-screen
- [ ] Smooth, animated transitions between questions
- [ ] Keyboard navigation (Enter / arrow keys to advance)
- [ ] Progress indicator
- [ ] Validation on the **client and the server** (required, email format, number, etc.)
- [ ] Submitting stores the response, then shows a **thank-you screen**
- [ ] No login required to fill a published form

### 2.4 Results / Responses
- [ ] Per-form responses view (table/list of submissions)
- [ ] View one response in full
- [ ] Basic summary stats per question (e.g. counts for choice questions)
- [ ] All responses persist in the DB

### 2.5 Typeform Look & Feel
- [ ] Conversational, one-at-a-time fill UI with transitions
- [ ] Clean builder layout with live preview
- [ ] Forms, modals and inline editing
- [ ] Notifications / toasts
- [ ] Settings placeholders (theme, thank-you screen)
- [ ] Overall it feels like Typeform, not a generic multi-field form

---

## 3. Placeholder Sections ("Coming Soon" is enough)

- [ ] Advanced logic jumps / branching (basic branching counts as a bonus)
- [ ] Integrations / webhooks
- [ ] Team collaboration & sharing
- [ ] Payment / file-upload question types
- [ ] Auth simplified: assume a default logged-in creator

---

## 4. Bonus (optional)

- [ ] Logic jumps / conditional branching
- [ ] Custom themes (colors, fonts, background)
- [ ] Export responses as CSV
- [ ] Partial-response tracking / completion rate
- [ ] File-upload question type
- [ ] Dark mode

---

## 5. Data & Documentation Requirements

- [ ] **Seed data:** a couple of published forms with mixed question types and some existing responses, so the app is usable right away
- [ ] **Database schema:** my own design, with proper relationships (this is graded)
- [ ] **README** includes:
  - [ ] Setup instructions
  - [ ] Tech stack used
  - [ ] Architecture overview
  - [ ] Database schema
  - [ ] API overview
  - [ ] Assumptions made
- [ ] **Original work:** no code copied from existing repos (plagiarism means disqualification)

---

## 6. Final Deliverables & Submission

- [ ] **Source code:** public GitHub repo containing `frontend/` and `backend/`
- [ ] **Documentation:** README as described above
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
