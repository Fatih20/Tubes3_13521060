// Evaluate mathematical expression
/**
 *
 * @param expression : mathematical expression
 * @returns Result number of the expression evaluated
 */
function evaluateMathExpression(expression: string): number {
  const regexPattern = /[-+*/()]|\d+\.?\d*|\.\d*|\d*\.\d+|\d+\(\d+\)/g;
  const allChar = /\S/g;
  const tokens = expression.match(regexPattern);
  const allChars = expression.match(allChar);
  if (!tokens || tokens.length !== allChars?.length) {
    throw new Error(`Invalid math expression: ${expression}`);
  }

  const operandStack: number[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (/\d/.test(token)) {
      operandStack.push(parseFloat(token));
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        const operator = operatorStack.pop()!;
        const operand2 = operandStack.pop()!;
        const operand1 = operandStack.pop()!;
        const result = applyOperator(operator, operand1, operand2);
        operandStack.push(result);
      }
      if (operatorStack[operatorStack.length - 1] === "(") {
        operatorStack.pop();
      }
    } else {
      while (
        operatorStack.length > 0 &&
        hasHigherPrecedence(operatorStack[operatorStack.length - 1], token)
      ) {
        const operator = operatorStack.pop()!;
        const operand2 = operandStack.pop()!;
        const operand1 = operandStack.pop()!;
        const result = applyOperator(operator, operand1, operand2);
        operandStack.push(result);
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    const operator = operatorStack.pop()!;
    const operand2 = operandStack.pop()!;
    const operand1 = operandStack.pop()!;
    const result = applyOperator(operator, operand1, operand2);
    operandStack.push(result);
  }

  if (operandStack.length !== 1 || operatorStack.length !== 0) {
    throw new Error(`Invalid math expression: ${expression}`);
  }

  return operandStack[0];
}

function hasHigherPrecedence(operator1: string, operator2: string): boolean {
  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };
  return precedence[operator1] >= precedence[operator2];
}

function applyOperator(
  operator: string,
  operand1: number,
  operand2: number
): number {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      if (operand2 === 0) {
        throw new Error("Division by zero");
      }
      return operand1 / operand2;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

export { evaluateMathExpression, hasHigherPrecedence, applyOperator };
