const form = document.querySelector('#equation-form');
const input = document.querySelector('#equation');
const results = document.querySelector('#results');

form.addEventListener('submit', e => {
    e.preventDefault();
    const equation = input.value;
    const result = parseEquation(equation);
    results.textContent = result;
});

input.addEventListener('keypress', e => {
    const invalidKey = new RegExp(/[^()^*\/+-\d.\s]/g).test(e.key);
    if (invalidKey) e.preventDefault();
});

const PARENTHESIS_REGEX = /\((?<equation>[\^\*\/\+\-\.\d\se]*)\)/;
const EXPONENT_REGEX = /(?<operand1>\-?[\d\.]+(e(\+|\-)\d+)?)\s*(?<operator>\^)\s*(?<operand2>\-?[\d\.]+(e(\+|\-)\d+)?)/;
const MULTIPLY_DIVIDE_REGEX = /(?<operand1>\-?[\d\.]+(e(\+|\-)\d+)?)\s*(?<operator>[\*\/])\s*(?<operand2>\-?[\d\.]+(e(\+|\-)\d+)?)/;
const ADD_SUBTRACT_REGEX = /(?<operand1>\-?[\d\.]+(e(\+|\-)\d+)?)\s*(?<operator>(?<!e)[\+\-])\s*(?<operand2>\-?[\d\.]+(e(\+|\-)\d+)?)/;

function parseEquation(equation) {
    // Parenthesis
    const parenthesis = equation.match(PARENTHESIS_REGEX);
    if (parenthesis) {
        const subEquation = parenthesis.groups.equation;
        const result = parseEquation(subEquation);
        const newEquation = equation.replace(PARENTHESIS_REGEX, result);
        return parseEquation(newEquation);
    }

    // Exponents
    const exponent = equation.match(EXPONENT_REGEX);
    if (exponent) {
        const result = handleOperation(exponent.groups);
        const newEquation = equation.replace(EXPONENT_REGEX, result);
        return parseEquation(newEquation);
    }

    // Multiplication / Division
    const multiplyDivide = equation.match(MULTIPLY_DIVIDE_REGEX);
    if (multiplyDivide) {
        const result = handleOperation(multiplyDivide.groups);
        const newEquation = equation.replace(MULTIPLY_DIVIDE_REGEX, result);
        return parseEquation(newEquation);
    }

    // Addition / Subtraction
    const addSubtract = equation.match(ADD_SUBTRACT_REGEX);
    if (addSubtract) {
        const result = handleOperation(addSubtract.groups);
        const newEquation = equation.replace(ADD_SUBTRACT_REGEX, result);
        return parseEquation(newEquation);
    }

    return parseFloat(equation);
}

function handleOperation({ operand1, operand2, operator }) {
    const number1 = parseFloat(operand1);
    const number2 = parseFloat(operand2);

    switch (operator) {
        case '^':
            return number1 ** number2;
        case '*':
            return number1 * number2;
        case '/':
            return number1 / number2;
        case '+':
            return number1 + number2;
        case '-':
            return number1 - number2;
        default:
            console.error(`Unknown operator: ${operator}`);
            break;
    }
}