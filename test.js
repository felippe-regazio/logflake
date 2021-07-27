const log = require('./dist/index.js')({
  onLog: (output, level, hash, trace) => {
    console.log(hash);
  }
});

log('hello world');