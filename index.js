const { tokenizer, parser, emitter } = require('./compiler.js');

const string = `
  (print "hello world")(add 2)
  (
  subtract 4 2)`;
console.log(compiler(string));
