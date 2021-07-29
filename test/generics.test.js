const path = require('path');
const util = require('util');
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
        let lastHash = lastTrace = '';

        log(_level, testword).get((output, level, hash, trace) => {
          cbRunned = true;
          lastHash = hash;
          lastTrace = trace;

          expect(global.console.log).toHaveBeenCalled();
          expect(output.includes(testword)).toBe(true);
          expect(output.includes(level.toUpperCase())).toBe(true);
          expect(_level).toEqual(level);
          expect(trace.includes(path.basename(__filename))).toBe(true);
        
          lastHash && expect(lastHash).toEqual(hash);
          lastTrace && expect(lastTrace).toEqual(trace);
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
        let lastHash = lastTrace = '';
        let strSample = util.format(data);

        log(testword, data).get((output, level, hash, trace) => {
          cbRunned = true;
          lastHash = hash;
          lastTrace = trace;

          expect(global.console.log).toHaveBeenCalled();
          expect(output.includes(testword)).toBe(true);
          expect(output.includes(level.toUpperCase())).toBe(true);
          expect(level).toBe('log');
          expect(trace.includes(path.basename(__filename))).toBe(true);
          expect(output.includes(strSample)).toBe(true);

          lastHash && expect(lastHash).toEqual(hash);
          lastTrace && expect(lastTrace).toEqual(trace);

          _allok = true;
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
          let lastHash = lastTrace = '';
          let strSample = util.format(data);
  
          log(_level, '%s', testword, data, 'Yeah!').get((output, level, hash, trace) => {
            cbRunned = true;
            lastHash = hash;
            lastTrace = trace;
  
            expect(global.console.log).toHaveBeenCalled();
            expect(output.includes(testword)).toBe(true);
            expect(output.includes(level.toUpperCase())).toBe(true);
            expect(_level).toEqual(level);
            expect(trace.includes(path.basename(__filename))).toBe(true);
            expect(output.includes(strSample)).toBe(true);
            expect(output.includes('Yeah!')).toBe(true);
            expect(output.includes('%s')).toBe(false);
          
            lastHash && expect(lastHash).toEqual(hash);
            lastTrace && expect(lastTrace).toEqual(trace);
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

    log('quiet', '%s', testword, 'Yeah!').get((output, level, hash, trace) => {
      cbRunned = true;
      lastHash = hash;
      lastTrace = trace;

      expect(global.console.log).not.toHaveBeenCalled();
      expect('quiet').toEqual(level);
      expect(output.includes(testword)).toBe(true);
      expect(output.includes(level.toUpperCase())).toBe(true);
      expect(trace.includes(path.basename(__filename))).toBe(true);
      expect(output.includes('Yeah!')).toBe(true);
      expect(output.includes('%s')).toBe(false);
    
      lastHash && expect(lastHash).toEqual(hash);
      lastTrace && expect(lastTrace).toEqual(trace);
    });

    if (!cbRunned) {
      throw new Error('log.get() callback function wasnt called. the method is not properly working');
    }     
  });
});