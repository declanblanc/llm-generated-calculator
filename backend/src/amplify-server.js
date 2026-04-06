const path = require('path');
const express = require('express');
const cors = require('cors');
const { calculate } = require('./calculate');

const app = express();
const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'static');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/calculate', (req, res) => {
  const { expression } = req.body ?? {};
  try {
    const result = calculate(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use(
  express.static(staticDir, {
    index: false,
    maxAge: '1h',
  })
);

app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Amplify calculator server listening on port ${PORT}`);
});
