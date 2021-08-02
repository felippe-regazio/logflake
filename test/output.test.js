import fs from 'fs';
import path from 'path';
import Output from '../dist/output.js';
import Helpers from '../dist/helpers.js';
import defaults from '../dist/defaults.js';

const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

beforeEach(() => {
  mockConsole.mockReset();
});

describe('Test output module', () => {
  const output = new Output(defaults);
  const helpers = new Helpers(defaults);

  it('printf', () => {
    const out = output.printf('log', [ 'Testing' ], 'abcdefgh', true);

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith(out);
    expect(out.includes('Testing')).toBe(true);
    expect(out.includes('[ CONSOLE LOG ]')).toBe(true);
  });

  it('getOutput', () => {
    const out = output.getOutput('log', [ 'Testing' ], 'abcdefgh', false);

    expect(out.includes('Testing')).toBe(true);
    expect(out.includes('[ CONSOLE LOG ]')).toBe(true);    
  });

  it('save', done => {
    const destDir = path.resolve(__dirname, 'logs'); 
    const out = output.getOutput('log', [ 'Testing' ], 'abcdefgh', false);
    const fileName = `${helpers.getDateStr()}.log`;

    output.save(destDir, 'log', [ 'Testing' ], 'abcdefgh');

    setTimeout(() => {
      const destFile = path.resolve(destDir, fileName);
      
      expect(fs.existsSync(destFile)).toBe(true);
      expect(fs.readFileSync(destFile).includes(out)).toBe(true);

      done();
    }, 500);
  });
});