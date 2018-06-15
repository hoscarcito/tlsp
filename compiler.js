

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
const tokenizeParOpen = (input, current) => tokenizeCharacter('paren', '(', input, current);
const tokenizeParClose = (input, current) => tokenizeCharacter('paren', ')', input, current);
const tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)
const tokenizeNumber = (input, current) => tokenizePattern('number', /[0-9]/, input, current);
const skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null];

const tokenizers = [tokenizeParOpen, tokenizeParClose, tokenizeString, tokenizeNumber, tokenizeName, skipWhiteSpace];

const tokenizer = (input) => {
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
const parseToken = (tokens) => {
  let current = 0;
  const walk = () => {
    let token = tokens[current];

    if (token.type === 'number') {
      current++;

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]; // Ignore parentesis
      const node = {
        type: 'CallExpression',
        name: token.value,  // Token "name"
        params: [],
      };

      token = tokens[++current]; // Next token

      while (!(token.type === 'paren' && token.value ===')')) {
        node.params.push(walk());
        token = tokens[current]; // Because token is inside the closure and we have to take it outside
      }

      current++;
      return node;

    }
    throw new TypeError(token.type);
    
  }

  const ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}


emitNumber = node => node.value;
emitString = node => `"${node.value}"`;
emitProgram = node =>  node.body.map(exp => emitter(exp) + ";").join('\n');
emitExpression = node => `${node.name}(${node.params.map(emitter).join(', ')})`
emitter = node => {
  switch (node.type) {
    case 'Program': return emitProgram(node);
    case 'CallExpression': return emitExpression(node);
    case 'StringLiteral': return emitString(node);
    case 'NumberLiteral': return emitNumber(node);
    default: throw new TypeError(node.type);
  }
}

module.exports = {
  tokenizer,
  parseToken,
  emitter
};
