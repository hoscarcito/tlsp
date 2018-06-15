const { tokenizer, parseToken, emitter } = require('./compiler.js');

const string = `
  (print "hello world")(add 2)
  (subtract 4 2)`;
const tokens = tokenizer(string);
const parsedTokens = parseToken(tokens);
const emitedTokens = emitter(parsedTokens);
console.log(JSON.stringify(emitedTokens));
