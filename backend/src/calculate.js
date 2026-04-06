function isDigit(char) {
  return char >= '0' && char <= '9';
}

function normalizeExpression(expression) {
  if (typeof expression !== 'string') {
    throw new Error('Expression must be a string');
  }

  const normalized = expression.replace(/\s+/g, '').replace(/x/g, '*').replace(/÷/g, '/');
  if (!normalized) {
    throw new Error('Expression is empty');
  }

  return normalized;
}

function tokenize(expression) {
  const tokens = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (isDigit(char) || char === '.') {
      let number = '';
      let dots = 0;
      while (i < expression.length && (isDigit(expression[i]) || expression[i] === '.')) {
        if (expression[i] === '.') {
          dots += 1;
          if (dots > 1) {
            throw new Error('Invalid decimal format');
          }
        }
        number += expression[i];
        i += 1;
      }
      if (number === '.') {
        throw new Error('Invalid number');
      }
      tokens.push(number);
      continue;
    }

    if ('+-*/%'.includes(char)) {
      const prev = tokens[tokens.length - 1];
      const isUnaryMinus = char === '-' && (!prev || '+-*/%'.includes(prev));
      if (isUnaryMinus) {
        let number = '-';
        i += 1;
        let dots = 0;
        while (i < expression.length && (isDigit(expression[i]) || expression[i] === '.')) {
          if (expression[i] === '.') {
            dots += 1;
            if (dots > 1) {
              throw new Error('Invalid decimal format');
            }
          }
          number += expression[i];
          i += 1;
        }
        if (number === '-' || number === '-.') {
          throw new Error('Invalid negative number');
        }
        tokens.push(number);
        continue;
      }

      tokens.push(char);
      i += 1;
      continue;
    }

    throw new Error(`Invalid character "${char}"`);
  }

  return tokens;
}

function toPostfix(tokens) {
  const output = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };

  tokens.forEach((token) => {
    if (!Number.isNaN(Number(token))) {
      output.push(token);
      return;
    }

    while (
      operators.length > 0 &&
      precedence[operators[operators.length - 1]] >= precedence[token]
    ) {
      output.push(operators.pop());
    }
    operators.push(token);
  });

  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
}

function evaluatePostfix(postfixTokens) {
  const stack = [];

  postfixTokens.forEach((token) => {
    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (right === undefined || left === undefined) {
      throw new Error('Invalid expression');
    }

    switch (token) {
      case '+':
        stack.push(left + right);
        break;
      case '-':
        stack.push(left - right);
        break;
      case '*':
        stack.push(left * right);
        break;
      case '/':
        if (right === 0) {
          throw new Error('Division by zero');
        }
        stack.push(left / right);
        break;
      case '%':
        if (right === 0) {
          throw new Error('Division by zero');
        }
        stack.push(left % right);
        break;
      default:
        throw new Error('Invalid operator');
    }
  });

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

function formatResult(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return String(Number(value.toFixed(12)));
}

function calculate(expression) {
  const normalized = normalizeExpression(expression);
  const tokens = tokenize(normalized);
  const postfix = toPostfix(tokens);
  const result = evaluatePostfix(postfix);
  return formatResult(result);
}

module.exports = { calculate };
