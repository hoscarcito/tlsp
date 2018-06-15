
tokenizer = (input) => {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let tokenized = false;
    tokenizers.forEach((tokenizer) => {
      if (tokenized) return;
      let [consumedChars, token] = tokenizer(input, current);
      if (consumedChars !== 0) {
        tokenized = true;
        current += consumedChars;
      }
      if (token) {
        tokens.push(token);
      }
    });
    if (!tokenized) {
      throw new TypeError('I dont know what this character is: ' + input[current]);
    }
  }
  return tokens;
}

const tokenizePattern = (type, pattern, input, current) => {
  let char = input[current];
  let consumedChars = 0;
  if (pattern.test(char)) {
    let value = '';
    while (char && pattern.test(char)) {
      value += char;
      consumedChars ++;
      char = input[current + consumedChars];
    }
    return [consumedChars , { type, value }];
  }
  return [0, null]
}

const tokenizeString = (input, current) => {
  if (input[current] === '"') {
    let value = '';
    let consumedChars = 0;
    consumedChars ++;
    char = input[current + consumedChars];
    while (char !== '"') {
      if(char === undefined) {
        throw new TypeError("unterminated string ");
      }
      value += char;
      consumedChars ++;
      char = input[current + consumedChars];
    }
    return [consumedChars + 1, { type: 'string', value }];
  }
  return [0, null]
}
const tokenizeCharacter = (type, value, input, current) => (value === input[current]) ? [1, { type, value }] : [0, null]
const tokenizeParOpen = (input, current) => tokenizeCharacter('parOpen', '(', input, current);
const tokenizeParClose = (input, current) => tokenizeCharacter('parClose', ')', input, current);
const tokenizeNumber = (input, current) => tokenizePattern('number', /[0-9]/, input, current);
const tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)
const skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null];

tokenizers = [tokenizeParOpen, tokenizeParClose, tokenizeString, tokenizeNumber, tokenizeName, skipWhiteSpace];


module.exports = {
  tokenizer
};
