const express = require('express');
const cors = require('cors');
const { calculate } = require('./calculate');

const app = express();
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Calculator backend listening on port ${PORT}`);
});
