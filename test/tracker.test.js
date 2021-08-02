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

  it('Test fnTrack', () => {
    let hashes = [];
    let hashA = tracker.fnTrack();
    let hashB = tracker.fnTrack();

    for(let i=0; i<10; i++) {
      hashes.push(tracker.fnTrack());
    }
    
    expect(hashes.length).toBe(10);
    expect(hashes[0].callCount).toBe(10);
    expect(new Set(hashes).size).toBe(1);
    expect(hashA.callCount).toBe(1);
    expect(hashB.callCount).toBe(1);
    expect(hashes[0].hash).not.toEqual(hashA.hash);
    expect(hashes[0].hash).not.toEqual(hashB.hash);
    expect(hashA.hash).not.toEqual(hashB.hash);
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

  it('Test fnCreateHash', () => {
    let hashes = [];
    let hashA = tracker.fnCreateHash();
    let hashB = tracker.fnCreateHash();

    for(let i=0; i<10; i++) {
      hashes.push(tracker.fnCreateHash());
    }
    
    expect(hashes.length).toBe(10);
    expect(new Set(hashes).size).toBe(1);
    expect(hashes[0]).not.toEqual(hashA);
    expect(hashes[0]).not.toEqual(hashB);
    expect(hashA).not.toEqual(hashB);
  });

  it('Test callCountInc', () => {
    [
      { given: -100, expect: 1 },
      { given: 100, expect: 101 },
      { given: 10000000, expect: 10000001 },
      { given: Math.MAX_SAFE_INTEGER, expect: Math.MAX_SAFE_INTEGER },
    ].forEach(item => {
      expect(tracker.callCountInc(item.given)).toBe(item.expect);
    });
  });

  it('Test read & mutateFnTrack', () => {
    let track = tracker.fnTrack();

    tracker.mutateFnTrack(track.hash, { hash: 'abcdefghijklmnopqrstuv' });
    expect(tracker.read('abcdefghijklmnopqrstuv')).toBeUndefined();
    expect(tracker.read(track.hash)).toBeDefined();

    tracker.mutateFnTrack(track.hash, { isDisabled: true });
    expect(tracker.read(track.hash).isDisabled).toBe(true);
  });
});