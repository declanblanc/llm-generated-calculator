## Basic Calculator (React + Node.js)

This project is a full-stack calculator:

- Frontend: React (Vite) in `frontend/`
- Backend: Node.js + Express in `backend/`
- Public backend function: `calculate(expression)` in `backend/src/calculate.js`

The frontend builds the expression string as you click buttons, handles `Clear` and `Backspace`, and calls the backend when `=` is pressed.

### Button support

- Numbers: `0-9` and `.`
- Functions: `+`, `-`, `x`, `÷`, `%`, `=`, `+/-`, `Clear`, `Backspace`

### Local setup and run

From the repo root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Run both frontend and backend together:

```bash
npm run dev
```

Then open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`

### Local testing

Run backend tests:

```bash
npm test
```

Build frontend:

```bash
npm run build
```

### AWS Amplify deployment

This repository is configured for a **single Amplify deployment**:

- Amplify builds the frontend from `frontend/`
- It packages a Node.js compute server that serves both:
  - the React build (`/`)
  - API routes (`/api/*`)

How it works:

- Build settings come from `amplify.yml` at the repo root.
- During the build, `scripts/prepare-amplify-hosting.js` creates `.amplify-hosting/`.
- The compute runtime uses `backend/src/amplify-server.js`.

For local development, Vite still proxies `/api/*` to `http://localhost:4000`.
