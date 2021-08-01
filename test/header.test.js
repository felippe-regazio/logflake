import Header  from '../dist/header.js';
import defaults  from '../dist/defaults';
import logger from '../dist/index';
import helpers from '../dist/helpers.js';

const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

beforeEach(() => {
  mockConsole.mockReset();
});


describe('Test console header output', () => {
  it('Check {prefix} option', () => {
    let log = null;
    let output = '';
    
    log = logger();
    log('This is a test').get(_output => (output = _output));
    expect(output.includes('[ CONSOLE LOG ]')).toBe(true);

    log = logger('test');
    log('This is a test').get(_output => (output = _output));
    expect(output.includes('[ TEST LOG ]')).toBe(true);

    log = logger({ prefix: 'test' });
    log('This is a test').get(_output => (output = _output));
    expect(output.includes('[ TEST LOG ]')).toBe(true);
  });

  it('Check {header} option', () => {
    let log = null;
    let output = '';
    
    log = logger({ header: false });
    log('This is a test').get(_output => (output = _output));
    expect(output.includes('[ CONSOLE LOG ]')).toBe(false);
  }); 

  it('Check the default header output', () => {
    const log = logger();

    log('quiet', 'Hakuna Matata').get((output, info) => {
      const _header = new Header(defaults).create('log', info.hash, true);
      const _helpers = new helpers(defaults);
      const _date = _helpers.getDateTime() ? _helpers.getDateTime().split(', ')[0] : '';

      const strCheck = [
        '[ CONSOLE LOG ]',
        _helpers.getPlatform(),
        _helpers.getUsername(),
        _helpers.getMain(),
        _date
      ].map(item => item);

      strCheck.forEach(str => {
        expect(output.includes(str)).toBe(true);
        expect(_header.includes(str)).toBe(true);
      });

      expect(output.includes(_header)).toBe(true);
    }, true);
  });

  it('Check header negative options', () => {
    const log = logger({
      username: false,
      datetime: false,
      platform: false,
      mainModule: false,
    });

    log('quiet', 'Hakuna Matata').get(output => {
      const _helpers = new helpers(defaults);
      const _date = _helpers.getDateTime() ? _helpers.getDateTime().split(', ')[0] : '';

      const strCheck = [
        _helpers.getUsername(),
        _helpers.getPlatform(),
        _helpers.getMain(),
        _date,
        'x1',
      ].map(item => item);      

      strCheck.forEach(str => {
        expect(output.includes(str)).toBe(false);
      });
    }, true);
  });

  it('Check {showLogHash, callCount} options', () => {
    const log = logger({ showLogHash: true, callCount: true });

    log('quiet', 'Hakuna Matata').get((output, info) => {
      expect(output.includes(info.hash)).toBe(true);
      expect(output.includes('x1')).toBe(true);
    }, true);
  });
});