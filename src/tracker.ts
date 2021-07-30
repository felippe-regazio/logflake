import md5 from 'md5';

const FnTracker = class {
  private fnPool: object;

  constructor() {
    this.fnPool = {};
  }

  fnTrack(): FnTrack {
    const hash: string = this.fnCreateHash();
    const fnTrack: FnTrack = this.fnPool[hash] || {};
    const callCount = this.callCountInc(fnTrack.callCount || 0);

    if (!fnTrack || fnTrack.fnDisabled !== true) {
      Object.assign(fnTrack, <FnTrack>{
        hash,
        callCount,
        fnDisabled: fnTrack.fnDisabled,
      });
    }

    this.fnPool[hash] = fnTrack;
    
    return fnTrack;
  }

  fnCreateHash(): string {
    const _stl = Error.stackTraceLimit;
    Error.stackTraceLimit = 1000;

    const trace = new Error().stack;
    Error.stackTraceLimit = _stl;

    return md5(trace);
  }

  callCountInc(callCount: number): number {
    return callCount < Number.MAX_SAFE_INTEGER ? ++callCount : callCount;
  }

  mutateFnTrack(hash: string, overrides: FnTrack): FnTrack {
    const track = this.fnPool[hash];

    if (track) {
      this.fnPool[hash] = {
        ...track,
        ...overrides
      };
    }

    return this.fnPool[hash];
  }

  read(hash: string) {
    return this.fnPool[hash];
  }
}

export default new FnTracker();