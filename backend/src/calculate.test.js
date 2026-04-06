const { calculate } = require('./calculate');

function expectEqual(actual, expected, name) {
  if (actual !== expected) {
    throw new Error(`${name} failed: expected "${expected}", got "${actual}"`);
  }
}

function expectThrow(fn, name) {
  try {
    fn();
    throw new Error(`${name} failed: expected function to throw`);
  } catch (error) {
    if (error.message.includes('expected function to throw')) {
      throw error;
    }
  }
}

expectEqual(calculate('2+3x4'), '14', 'operator precedence');
expectEqual(calculate('10÷4'), '2.5', 'division');
expectEqual(calculate('5.5+1.2'), '6.7', 'decimal addition');
expectEqual(calculate('-3+8'), '5', 'negative number');
expectEqual(calculate('10%3'), '1', 'modulo');
expectThrow(() => calculate('2++3'), 'invalid expression');
expectThrow(() => calculate('8÷0'), 'division by zero');

console.log('All calculate() tests passed.');
