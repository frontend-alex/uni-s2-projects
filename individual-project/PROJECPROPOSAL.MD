# PeerLearn — A Collaborative Study Platform

**Core Idea:**
A platform where students can create study rooms for courses. Each room has:

* **Shared Notes** (real-time collaborative editor, like a mini Notion/Google Docs).
* **Flashcards & Quizzes** (auto-generated from notes using AI wrappers).
* **Chat + Voice (WebRTC)** for live group study.
* **Progress Tracking** (gamified XP system, badges for consistency).


###  How You’d Build It

* **Backend (.NET Core Web API):**

  * Identity/Auth (JWT or ASP.NET Identity).
  * Models: `User`, `Room`, `Note`, `Flashcard`, `QuizResult`.
  * SignalR for realtime updates (instead of socket.io).
  * EF Core for database (MongoDb).
  * Optional AI endpoints (OpenAI API or huggingface integration).

* **Frontend (React):**

  * Collaborative editor (Slate.js, synced via SignalR).
  * Dashboard for rooms, study stats, and XP badges.
  * Flashcard & quiz UI.


### Timeline (4 Months)

* **Month 1:**

  * Backend scaffolding (Models, Auth, CRUD for Rooms/Notes).
  * Frontend auth + dashboard.

* **Month 2:**

  * Real-time collaboration (SignalR).
  * Flashcards + quizzes system.

* **Month 3:**

  * Progress tracking + gamification.
  * Polish UI, write docs, prep demo.





