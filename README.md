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

### AWS Amplify notes

- `frontend/` is deploy-ready as a static React app.
- The repo includes `amplify.yml` configured to build and publish `frontend/dist`.
- For production API calls, set an environment variable in Amplify:
  - `VITE_API_URL=https://<your-api-domain>`
- The app calls `${VITE_API_URL}/api/calculate` in production.
- For local dev, Vite proxies `/api/*` to `http://localhost:4000`.
- `frontend/.env.example` is included to show expected environment variables.
