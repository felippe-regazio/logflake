import logger from '../dist/index.js';
import tracker from '../dist/tracker.js';

const mockConsole = jest.fn();

beforeAll(() => {
  ['log', 'info', 'warn', 'trace', 'error'].forEach(level => {
    global.console[level] = mockConsole;
  });
});

describe('Test tracker', () => {
  const log = logger();

  it('Test if track properties are right', () => {
    log('Testing').get((output, info) => {
      const track = tracker.read(info.hash);
      expect(Object.keys(track).length > 0).toBe(true);
      expect(track.callCount).toBe(1);
      expect(track.fnDisabled).toBe(undefined);
    });
  });

  it('Test if track counter is right', () => {
    for(let i = 0; i<100; i++) {
      log('Testing').get((output, info) => {
        const track = tracker.read(info.hash);
        expect(track.callCount).toBe(i + 1);
      });
    }
  }); 
  
  it('Test fn disabled flag', () => {
    for(let i = 0; i<100; i++) {
      log('Testing').once().get((output, info) => {
        const track = tracker.read(info.hash);

        expect(track.callCount).toBe(1);
        expect(track.fnDisabled).toBe(true);
      });
    }
  });
});