const input = document.querySelectorAll(".s");
const output = document.getElementById("output");

let str = "";
let flag = false;

class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    if (this.items.length == 0) return "Underflow";
    return this.items.pop();
  }
}

// Function to convert infix expression to postfix
function infixToPostfix(infix) {
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };

  const isOperator = (c) => ["+", "-", "*", "/", "^"].includes(c);
  const precedenceOf = (c) => precedence[c] || 0;
  const associativityOf = (c) => (c === "^" ? "Right" : "Left");

  const output = [];
  const operators = [];
  let numberBuffer = "";

  for (let i = 0; i < infix.length; i++) {
    const token = infix[i];

    if (!isNaN(token) || token === ".") {
      numberBuffer += token;
    } else {
      if (numberBuffer.length > 0) {
        output.push(numberBuffer);
        numberBuffer = "";
      }

      if (isOperator(token)) {
        while (
          operators.length &&
          isOperator(operators[operators.length - 1]) &&
          ((associativityOf(token) === "Left" &&
            precedenceOf(token) <=
              precedenceOf(operators[operators.length - 1])) ||
            (associativityOf(token) === "Right" &&
              precedenceOf(token) <
                precedenceOf(operators[operators.length - 1])))
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          output.push(operators.pop());
        }
        operators.pop(); // pop the '('
      }
    }
  }

  if (numberBuffer.length > 0) {
    output.push(numberBuffer);
  }

  while (operators.length) {
    output.push(operators.pop());
  }

  return output.join(" ");
}

// Function to evaluate postfix expression
function evaluatePostfix(postfix) {
  flag = false;
  const stack = [];
  const tokens = postfix.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${token}`);
      }
    }
  }
  flag = true;
  return stack.pop();
}

const enterInput = (entry) => {
  if (entry == "C" && flag == true) {
    str = "";
    output.innerText = str;
  }
  if (entry == "C") {
    str = str.slice(0, str.length - 1);
    output.innerText = str;
  } else if (entry == "AC") {
    str = "";
    output.innerText = str;
  } else if (entry == "=") {
    str = infixToPostfix(str);
    str = evaluatePostfix(str);
    output.innerText = str;
  } else {
    str += entry;
    output.innerText = str;
  }
};

input.forEach((val) => {
  val.addEventListener("click", () => {
    const entry = val.getAttribute("id");
    enterInput(entry);
  });
});
