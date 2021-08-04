import logger from '../dist/';
import Helpers from '../dist/helpers.js';
import tracker from '../dist/tracker.js';
import defaults from '../dist/defaults.js';

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = jest.fn();
  });
});

describe('Test helpers module', () => {
  const _helpers = new Helpers(defaults);

  it('getChalk', () => {
    const chalk = _helpers.getChalk();
    expect(chalk.Instance).toBeDefined();
  });

  it('getLogLevels', () => {
    const logLevels = _helpers.getLogLevels();
    const log = logger();
    const stripHeader = str => str.split('\n').slice(1).join('\n');

    expect(Object.keys(logLevels).length > 0).toBe(true);
    
    for(let level in logLevels) {
      log(level, 'Testing').get(output => {
        if (level !== 'quiet') {
          expect(output.includes(level.toUpperCase())).toBe(true);
          output = stripHeader(output);
          expect(output.includes(level)).toBe(false);
        } else {
          expect(output.includes(level.toUpperCase())).toBe(false);
          output = stripHeader(output);
          expect(output.includes('LOG')).toBe(false);
        }
      });
    };
  });

  it('getDateTime', () => {
    const datetimeEn = _helpers.getDateTime();
    const datetimeBr = _helpers.getDateTime('pt-BR');
    
    expect(datetimeEn !== datetimeBr).toBe(true);
    expect(datetimeEn.length > 0 && datetimeEn.length > 0).toBe(true);
  });

  it('getMain | getUsername | getPlatform', () => {
    const test = [ 'getMain', 'getUsername', 'getPlatform' ];

    test.forEach(fn => {
      const result = _helpers[fn]();
  
      expect(typeof result === 'string').toBe(true);
      expect(result.length > 0).toBe(true);
    });
  });

  it('getCallCountStr', () => {
    const log = logger();
    
    log('Testing', (output, info) => {
      const track = tracker.read(info.hash);

      expect(_helpers.getCallCountStr(track)).toBe('x1');
    });
  });

  it('line', () => {
    const line = _helpers.line();

    expect(line.includes(defaults.linesChar)).toBe(true);
  });

  it('getDateStr', () => {
    const dateStr = _helpers.getDateStr();
    const parts = dateStr.split('-');
    const date = new Date();

    expect(typeof dateStr === 'string').toBe(true);
    expect(dateStr.length > 0).toBe(true);
    expect(parts[0]).toEqual(String(date.getFullYear()));
    expect(parts[2]).toEqual(String(date.getDate()));
    expect(parts[1]).toEqual(String(date.getMonth() + 1));
  });

  it('noopChain', () => {
    const fakeChain = () => ({ testA: () => 1, testB: () => 2, testC: () => 3 });
    const noop = _helpers.noopChain(fakeChain);

    for(fn in fakeChain) {
      expect(noop[fn]).toEqual(noop);
      expect(noop[fn][fn]).toEqual(noop);
      expect(noop[fn][fn][fn]).toEqual(noop); // infinite...
    }
  });
});