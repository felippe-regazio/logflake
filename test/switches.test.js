import logger from '../dist/index.js';

const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

beforeEach(() => {
  mockConsole.mockReset();
});

describe('Test log options', () => {
  it('Check {disabled} option', () => {
    let log = null;
    let output = '';
    
    log = logger({ disabled: true });
    log('This is a test').get(_output => (output = _output));

    expect(global.console.log).not.toHaveBeenCalled();
    expect(output.includes('[ CONSOLE LOG ]')).toBe(false);
  });

  it('Check {seamless} option', () => {
    let log = null;
    let output = '';
    
    log = logger({ seamless: true });
    log('This is a test').get(_output => (output = _output));
    expect(output.includes('[ CONSOLE LOG ]')).toBe(false);
  });

  it('Check {alwaysQuiet} option', () => {
    let log = null;
    let output = '';
    
    log = logger({ alwaysQuiet: true });
    log('This is a test').get(_output => (output = _output));

    expect(global.console.log).not.toHaveBeenCalled();
    expect(output.includes('[ CONSOLE LOG ]')).toBe(true);
  });  
});