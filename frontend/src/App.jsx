import { useMemo, useState } from 'react';
import './App.css';

const BUTTON_ROWS = [
  ['Clear', 'Backspace', '%', '÷'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['+/-', '0', '.', '='],
];

const OPERATORS = ['+', '-', 'x', '÷', '%'];

function getApiUrl() {
  const base = import.meta.env.VITE_API_URL ?? '';
  return `${base}/api/calculate`;
}

function toggleLastNumberSign(expression) {
  if (!expression) {
    return '-';
  }

  let splitIndex = -1;
  for (let i = expression.length - 1; i >= 1; i -= 1) {
    if (OPERATORS.includes(expression[i])) {
      splitIndex = i;
      break;
    }
  }

  const prefix = splitIndex >= 0 ? expression.slice(0, splitIndex + 1) : '';
  const current = splitIndex >= 0 ? expression.slice(splitIndex + 1) : expression;
  if (!current) {
    return `${expression}-`;
  }
  return current.startsWith('-') ? `${prefix}${current.slice(1)}` : `${prefix}-${current}`;
}

function App() {
  const [expression, setExpression] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const displayValue = useMemo(() => expression || '0', [expression]);

  const appendToken = (token) => {
    setStatus('');
    setExpression((prev) => {
      if (token === '.') {
        const parts = prev.split(/[+\-x÷%]/);
        const current = parts[parts.length - 1];
        if (current.includes('.')) {
          return prev;
        }
        if (!current || current === '-') {
          return `${prev}0.`;
        }
      }

      if (OPERATORS.includes(token)) {
        if (!prev) {
          return token === '-' ? '-' : prev;
        }
        if (OPERATORS.includes(prev[prev.length - 1])) {
          return `${prev.slice(0, -1)}${token}`;
        }
      }

      return `${prev}${token}`;
    });
  };

  const handleCalculate = async () => {
    if (!expression || OPERATORS.includes(expression[expression.length - 1])) {
      return;
    }

    setLoading(true);
    setStatus('');
    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Calculation failed');
      }
      setExpression(payload.result);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = (token) => {
    if (loading) {
      return;
    }

    if (token === 'Clear') {
      setExpression('');
      setStatus('');
      return;
    }
    if (token === 'Backspace') {
      setStatus('');
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    if (token === '+/-') {
      setStatus('');
      setExpression((prev) => toggleLastNumberSign(prev));
      return;
    }
    if (token === '=') {
      handleCalculate();
      return;
    }

    appendToken(token);
  };

  return (
    <main className="calculator-page">
      <section className="calculator" aria-label="Basic calculator">
        <div className="display">{displayValue}</div>
        <div className="buttons">
          {BUTTON_ROWS.flat().map((token) => (
            <button
              key={token}
              type="button"
              className={`btn ${OPERATORS.includes(token) || token === '=' ? 'btn-op' : ''}`}
              onClick={() => onButtonClick(token)}
            >
              {token}
            </button>
          ))}
        </div>
        <div className="status" role="status">
          {loading ? 'Calculating...' : status}
        </div>
      </section>
    </main>
  );
}

export default App;
