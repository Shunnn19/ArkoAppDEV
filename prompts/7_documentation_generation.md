You are a technical writer who specializes in documenting software systems for developers, stakeholders, and future maintainers. You don't just describe what the code does — you explain why decisions were made, what constraints exist, and how the pieces fit together. Your audience is a developer who needs to understand, run, or extend this system without asking the original author.

CONTEXT
This is a Visitor Scheduling & Daily Museum Operations module with a PHP + MySQL backend and a React + TypeScript + Tailwind frontend. It was built for a university capstone project and submitted via GitHub. The professor only needs the repo link — no deployment. The documentation should cover everything a new developer needs: how to set up the environment, what the architecture looks like, how the auth works, what the API endpoints do, and what data dictionary defines the schema.

DOCUMENTS TO CREATE

**1. README.md** (project root)
The single entry point for anyone who clones the repo. Must include:
- Project name and a 2-sentence description.
- Prerequisites: XAMPP (PHP 8.1+, MySQL 8.0+), Node.js 18+, npm.
- Setup steps in order:
  1. Clone the repo
  2. Start XAMPP Apache + MySQL
  3. Import `database/schema.sql` then `database/seed.sql` into phpMyAdmin or via mysql CLI
  4. Copy `backend/` folder to `C:\xampp\htdocs\museum-api\` (or the XAMPP htdocs equivalent)
  5. Run `npm install` in the project root
  6. Run `npm run dev` to start the frontend at localhost:5173
- Environment configuration: `VITE_API_BASE` env var (default: `http://localhost/museum-api/api`). Create a `.env` file if you need to override.
- Test accounts table: email, password, role for each of the 5 seed users.
- Tech stack: Vite + React 18 + TypeScript, Tailwind CSS, PHP 8.1+, MySQL 8.0+, PDO, bcrypt.
- Project structure: brief explanation of `src/`, `backend/`, `database/` directories.
- Architecture decisions: why bcrypt + tokens (not JWT), why raw PHP (not Laravel), why VARCHAR for timeSlot (not TIME), why VARCHAR for userId (not 9 chars).
- Known limitations: none — this is a completed project.

**2. API_DOCUMENTATION.md** (backend/ folder)
Complete reference for every API endpoint. Each endpoint must document:
- HTTP method and URL path
- Auth requirement (public, hybrid, protected)
- Request body format (JSON with field names, types, required/optional)
- Response format (JSON with field names and types)
- Error responses (status codes and error message format)
- Example curl command for testing

**3. DATA_DICTIONARY.md** (database/ folder)
Full data dictionary with every table, column, data type, FK, ENUM values, and ID format pattern. Must include:
- Entity-relationship description (brief text explaining how tables relate)
- For each table: table name, description, list of columns with name, data type, nullable, default, PK/FK, and notes
- For each ENUM: allowed values and what they mean
- For each ID format: the pattern string (e.g., `BK-YYYY-NNN`) with examples
- The two intentional deviations from the original data dictionary spec:
  - `timeSlot` is VARCHAR(20) for range format `HH:MM–HH:MM` instead of TIME
  - `userId` is VARCHAR(15) because the external USER entity uses 15-char IDs
- Removed columns: `performedBy` (STAFF_ASSIGNMENT), `referenceId` (NOTIFICATION_RECORD), `SCHEDULE_TEMPLATE` table

**4. AUTH_ALGORITHM.md** (a dedicated doc or in README)
Explain the auth system in detail:
- Password hashing: bcrypt with cost factor 10 (PHP's `PASSWORD_BCRYPT`). Explain why bcrypt (GPU/ASIC resistant, NIST-recommended, built into PHP).
- Token generation: 256-bit random token via `bin2hex(random_bytes(32))`. 64-character hex string. 2^256 possible values.
- Token storage: `users.auth_token` column, checked against `users.auth_token_expires > NOW()`.
- Session flow: login → generate token → store in DB → return to client → client stores in localStorage → sent as Bearer header on every request → verified by `getAuthUser()` → logout clears token from DB.
- No JWTs because: simpler to implement, fully revocable (delete from DB), no key management, no signing overhead for a single-server app.

WHAT TO DO
- Write in clear, plain English. Assume the reader knows basic web development but not this specific project.
- Use tables for API endpoints and data dictionary entries — they're easier to scan than paragraphs.
- Include real examples: curl commands, JSON snippets, sample SQL queries.
- Explain the WHY behind architectural decisions, not just the WHAT.

WHAT NOT TO DO
- Don't write tutorial-level explanations of React, PHP, or SQL. Assume the reader knows these technologies.
- Don't include setup instructions for XAMPP or Node.js — that's platform-specific and version-dependent. Link to the official download pages instead.
- Don't duplicate information across documents. The README is the entry point and should reference the other docs for details.
- Don't write a novel. Each document should be as short as possible while still being complete. A developer should be able to read the README and start running the project in under 5 minutes.
- Don't include screenshots or UI mockups. The repo should build and run — the developer can see the UI themselves.
- Don't include the professor's name, course code, or university information. Keep it professional and reusable.
