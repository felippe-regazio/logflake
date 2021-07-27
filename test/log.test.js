const logger = require('../dist/index.js');
const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

beforeEach(() => {
  mockConsole.mockReset();
});

describe('Test instantiation', () => {
  it('Checking the exported HOF', () => {
    expect(typeof logger).toBe('function');
  });

  it('Use log() fn creation', () => {
    const log = logger();

    expect(typeof log).toBe('function');
  });

  it('Basic log() usage', () => {
    const log = logger();

    log('Hello world');
    expect(global.console.log).toHaveBeenCalledWith('Hello world');
    
    log('Hello %s', 'world again');
    expect(global.console.log).toHaveBeenCalledWith('Hello %s', 'world again');

    log(...[1, 2, 3, 4, 5]);
    expect(global.console.log).toHaveBeenCalledWith(1, 2, 3, 4, 5);

    log('Spread is ok', ...[1, 2, 3, 4, 5]);
    expect(global.console.log).toHaveBeenCalledWith('Spread is ok', 1, 2, 3, 4, 5);
  });

  it('Different log() levels', () => {
    const log = logger();

    [ 'log', 'info', 'warn', 'error', 'trace' ].forEach(level => {
      const msg = `Testing "${level}" log level`;

      log(level, msg);
      expect(global.console[level]).toHaveBeenCalledWith(msg);

      log(level, msg, 100);
      expect(global.console[level]).toHaveBeenCalledWith(msg, 100);

      log(level, msg, ...[1, 2, 3, 4, 5]);
      expect(global.console[level]).toHaveBeenCalledWith(msg, 1, 2, 3, 4, 5);
    });
  });

  it('Checks special quiet log level', () => {
    const log = logger();

    log('quiet', 'Hello world');
    expect(global.console.log).not.toHaveBeenCalled();
  });

  it('Checking log header', () => {
    const log = logger();

    log('Hello world');
    
    const header = mockConsole.mock.calls[0][0];
    expect(header.includes('[ CONSOLE LOG ]')).toBe(true);
  });
});