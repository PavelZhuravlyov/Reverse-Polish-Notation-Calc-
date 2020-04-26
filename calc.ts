type StackSymbolsType = Array<number | string>;
type StackSymbolItemType = number | string;

function solution(expression: string): number {
  const stackExpression: StackSymbolsType = getStackSymbols(expression);
  return calcExpression(stackExpression);
}

function calcExpression(expressionStack: StackSymbolsType): number {
  let current: StackSymbolItemType;
  let bufDigits: number[] = [];
 
  while (current = expressionStack.shift()) {
    if (!isNaN(+current)) {
      bufDigits.push(+current);
      continue;
    }

    let [ a, b ] = [ bufDigits.pop(), bufDigits.pop() ];
    bufDigits.push(eval(`${ b }${ current }${ a }`));
  }

  return bufDigits[0];
}

function getStackSymbols(expression: string): StackSymbolsType {
  const symbols: StackSymbolsType = normalizeExpression(expression);
  let result: StackSymbolsType = [];
  let operations: StackSymbolsType = [];
  let operands: StackSymbolsType = [];

  let openBracketPosition: number | null = null;

  const HIGH_PRIOR_SYMBOLS = new Set(['*', '/']);

  symbols.forEach((symbol, index) => {
    if (!isNaN(+symbol)) {
      operands.push(+symbol);
    } else {
      const isHighPrior = HIGH_PRIOR_SYMBOLS.has(symbol.toString());

      if (symbol === '(') {
        openBracketPosition = operations.length;
        return;
      }

      if (symbol === ')') {
        // get part with operations beetween brackets ()
        const bracketsBlock: StackSymbolsType = operations.splice(openBracketPosition, operations.length);

        openBracketPosition = operations.indexOf('(') > -1 ? operations.indexOf('(') : null;
        operands = operands.concat(bracketsBlock.reverse());

        return;
      }

      if (!operations.length) {
        operations.push(symbol);
        return;
      }

      if (!isHighPrior && !openBracketPosition) {
        operands.push(operations.pop());
        operations.push(symbol);
        return;
      }

      operations.push(symbol);
    }
  });

  return operands.concat(operations.reverse());
}

function normalizeExpression(expression: string): StackSymbolsType {
  const symbols = expression.split('').filter((item) => item.trim());
  const result: StackSymbolsType = []; 

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];

    if (!isNaN(+symbol)) {
      let j: number = i + 1;
      const digits: number[] = [];

      digits.push(+symbol);

      while (!isNaN(+symbols[j])) {
        digits.push(+symbols[j]);
        j++;
        i++;
      }

      result.push(digits.join(''));
    } else {
      result.push(symbol);
    }
  }

  return result;
}

console.log(solution('((1+2) + 1)+(3 + 4) * 3'));
console.log(solution('(6 + 10 - 4) / (1 + 1 * 2) + 1'));
console.log(solution('(1 + 2) * 4 + 3'));
console.log(solution('7 -2 * 3'));
console.log(solution('5*2 + 10'));
