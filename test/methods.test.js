import fs from 'fs';
import path from 'path';
import logger from '../dist/index.js';
import Helpers from '../dist/helpers.js';
import defaults from '../dist/defaults.js';

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = jest.fn();
  });
});

describe('Test log chained methods', () => {
  const helpers = new Helpers(defaults);
  const log = logger({ logDir: path.resolve(__dirname, 'logs') });
  
  const destDir = path.resolve(__dirname, 'logs');  
  const fileName = `${helpers.getDateStr()}.log`;
  const destFile = path.resolve(destDir, fileName);

  it('Method save', done => {
    const msg = `This is a save method test ${ new Date() }`;

    log(msg).save();

    setTimeout(() => {
      expect(fs.existsSync(destFile)).toBe(true);
      expect(fs.readFileSync(destFile).includes(msg)).toBe(true);
    
      done();
    }, 200);
  });

  it('Method once', () => {
    let outputs = [];

    for(let i = 0; i < 10; i++) {
      log('Testing once').once().get(output => {
        outputs.push(output);
      });
    }

    expect(outputs.length).toBe(1);
  });

  it('Method get', () => {
    log('Testing get').get((output, info) => {
      expect(output.includes('[ CONSOLE LOG ]')).toBe(true);
      expect(output.includes('Testing get')).toBe(true);
      expect(typeof info).toBe('object');

      const infoAssert = {
        hash: 'string',
        trace: 'string',
        level: 'string',
        date: 'object',
        dateUTC: 'string',
        callCount: 'number'
      };

      for(let item in infoAssert) {
        expect(info[item] && typeof info[item] === infoAssert[item]).toBe(true);
      }
    });
  });

  it('Method fire', () => {
    const msg = 'Testing fire';
    const logIt = log('quiet', msg);

    logIt.fire().get((output, info) => {
      expect(output.includes(msg)).toBe(true);
      expect(info.callCount).toBe(1);
      expect(info.level).toBe('log');
    });

    logIt.fire('error').get((output, info) => {
      expect(info.level).toBe('error');
    });

    logIt.fire('log', 'again').get((output) => {
      expect(output.includes(msg + ' again')).toBe(true);
    });
  });
});