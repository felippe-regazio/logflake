const logger = require('../dist/index.min.js');

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = jest.fn();
  });
});

describe('Test microlog', () => {
  it('Checks the exported HOF', () => {
    expect(typeof logger).toBe('function');
  });

  it('Checks basic default usage', () => {
    const log = logger();

    log('Testing');
  });
});