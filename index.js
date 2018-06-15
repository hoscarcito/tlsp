const { tokenizer, parseToken } = require('./compiler.js');

const string = '(coso 2 (add 23 3))';
const tokens = tokenizer('(coso 2 (add 23 3))');
const parsedTokens = parseToken(tokens);
console.log(parsedTokens);
