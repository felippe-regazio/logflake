import path from 'path';
import util from 'util';

const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

beforeEach(() => {
  mockConsole.mockReset();
});

describe('Assert that common executions wont fail', () => {
  it('Test error throwing and output of basic usage', () => {
    let _error = null;

    try {
      const testword = 'Blueline Tilefish';
      const logger = require('../dist/index');
      const log = logger();

      [
        'log',
        'info',
        'warn',
        'error',
        'trace'        
      ].forEach(_level => {
        let cbRunned = false;
        let lastHash = ''; 
        let lastTrace = '';

        log(_level, testword).get((output, info) => {
          cbRunned = true;
          lastHash = info.hash;
          lastTrace = info.trace;

          expect(global.console.log).toHaveBeenCalled();
          expect(output.includes(testword)).toBe(true);
          expect(output.includes(info.level.toUpperCase())).toBe(true);
          expect(_level).toEqual(info.level);
          expect(info.trace.includes(path.basename(__filename))).toBe(true);
        
          lastHash && expect(lastHash).toEqual(info.hash);
          lastTrace && expect(lastTrace).toEqual(info.trace);
        });

        if (!cbRunned) {
          throw new Error('log.get() callback function wasnt called. the method is not properly working');
        } 
      });

    } catch(error) {
      _error = error;
    }

    expect(_error).toBe(null);
  });

  it('Test log with different types of data', () => {
    let _error = null;

    try {
      const testword = 'Blueline Tilefish';
      const logger = require('../dist/index');
      const log = logger();

      const samples = [
        'data-log',
        [ 1, 2, 3, 4, 5],
        { fizz: 1, buzz: 2 },
        function() { },
        12312312312312
      ];
      
      samples.forEach(data => {
        let cbRunned = false;        
        let lastHash = '';
        let lastTrace = '';
        let strSample = util.format(data);

        log(testword, data).get((output, info) => {
          cbRunned = true;
          lastHash = info.hash;
          lastTrace = info.trace;

          expect(global.console.log).toHaveBeenCalled();
          expect(output.includes(testword)).toBe(true);
          expect(output.includes(info.level.toUpperCase())).toBe(true);
          expect(info.level).toBe('log');
          expect(info.trace.includes(path.basename(__filename))).toBe(true);
          expect(output.includes(strSample)).toBe(true);

          lastHash && expect(lastHash).toEqual(info.hash);
          lastTrace && expect(lastTrace).toEqual(info.trace);

          cbRunned = true;
        });
        
        if (!cbRunned) {
          throw new Error('log.get() callback function wasnt called. the method is not properly working');
        }         
      });
    } catch(error) {
      _error = error;
    } 

    expect(_error).toBe(null);
  });

  it('Test different log levels with different types of data', () => {
    let _error = null;

    try {
      const testword = 'Blueline Tilefish';
      const logger = require('../dist/index');
      const log = logger();

      const samples = [
        'data-log',
        [ 1, 2, 3, 4, 5],
        { fizz: 1, buzz: 2 },
        function() { },
        12312312312312,
        1.444,
        this,
        require,
        module,
        '%d %d',
        new Date()
      ];

      [
        'log',
        'info',
        'warn',
        'error',
        'trace'        
      ].forEach(_level => {
        samples.forEach(data => {
          let cbRunned = false;
          let lastHash =  '';
          let lastTrace = '';
          let strSample = util.format(data);
  
          log(_level, '%s', testword, data, 'Yeah!').get((output, info) => {
            cbRunned = true;
            lastHash = info.hash;
            lastTrace = info.trace;
  
            expect(global.console.log).toHaveBeenCalled();
            expect(output.includes(testword)).toBe(true);
            expect(output.includes(info.level.toUpperCase())).toBe(true);
            expect(_level).toEqual(info.level);
            expect(info.trace.includes(path.basename(__filename))).toBe(true);
            expect(output.includes(strSample)).toBe(true);
            expect(output.includes('Yeah!')).toBe(true);
            expect(output.includes('%s')).toBe(false);
          
            lastHash && expect(lastHash).toEqual(info.hash);
            lastTrace && expect(lastTrace).toEqual(info.trace);
          });

          if (!cbRunned) {
            throw new Error('log.get() callback function wasnt called. the method is not properly working');
          }           
        });      
      });         
    } catch(error) {
      _error = error;
    } 

    expect(_error).toBe(null);
  });

  it('Test quiet log level', () => {
    const testword = 'Blueline Tilefish';
    const logger = require('../dist/index');
    const log = logger();

    let cbRunned = false;

    log('quiet', '%s', testword, 'Yeah!').get((output, info) => {
      cbRunned = true;

      expect(global.console.log).not.toHaveBeenCalled();
      expect('quiet').toEqual(info.level);
      expect(output.includes(testword)).toBe(true);
      expect(output.includes('LOG')).toBe(true);
      expect(info.trace.includes(path.basename(__filename))).toBe(true);
      expect(output.includes('Yeah!')).toBe(true);
      expect(output.includes('%s')).toBe(false);
    });

    if (!cbRunned) {
      throw new Error('log.get() callback function wasnt called. the method is not properly working');
    }     
  });
});