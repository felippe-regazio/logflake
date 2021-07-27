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
  it('Log header basic namespace changing', () => {
    const log = logger('test');

    log('Hello world');
    
    const header = mockConsole.mock.calls[0][0];
    expect(header.includes('[ TEST LOG ]')).toBe(true);
  });

  it('Log header namespace changing by options', () => {
    const log = logger({ prefix: 'test' });

    log('Hello world');
    
    const header = mockConsole.mock.calls[0][0];
    expect(header.includes('[ TEST LOG ]')).toBe(true);
  });

  it('Use lines option', () => {
    const log = logger({ lines: true });

    log('Hello world');
    
    const call = mockConsole.mock.calls[0];
    const lines = [ call[0], call[call.length - 1] ];

    lines.forEach(line => {
      expect(line.includes('·····')).toBe(true);    
    });
  });

  it('Use lines option with custom char', () => {
    const log = logger({ lines: true, linesChar: '*' });

    log('Hello world');
    
    const call = mockConsole.mock.calls[0];
    const lines = [ call[0], call[call.length - 1] ];

    lines.forEach(line => {
      expect(line.includes('*****')).toBe(true);    
    });
  });

  it('Checks disabled and always quiet option', () => {
    const logDisabled = logger({ disabled: true });
    const logAlwaysQuiet = logger({ alwaysQuiet: true });

    [ logDisabled, logAlwaysQuiet ].forEach(log => {
      [ 'log', 'info', 'warn', 'error', 'trace' ].forEach(level => {
        log(level, 'Hello world');
    
        expect(global.console[level]).not.toHaveBeenCalled();
      });
    });
  });
});