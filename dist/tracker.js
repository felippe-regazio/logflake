"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const FnTracker = class {
    constructor() {
        this.fnPool = {};
    }
    fnTrack() {
        const hash = this.fnCallHash();
        const fnTrack = this.fnPool[hash] || {};
        const callCount = fnTrack.callCount ? ++fnTrack.callCount : 1;
        if (!fnTrack || fnTrack.fnDisabled !== true) {
            Object.assign(fnTrack, {
                hash,
                callCount,
                once: fnTrack.once,
                fnDisabled: fnTrack.fnDisabled,
            });
        }
        this.fnPool[hash] = fnTrack;
        return fnTrack;
    }
    fnCallHash() {
        const _stl = Error.stackTraceLimit;
        Error.stackTraceLimit = 1000;
        const trace = new Error().stack;
        Error.stackTraceLimit = _stl;
        return md5_1.default(trace);
    }
    mutateFnTrack(hash, overrides) {
        const track = this.fnPool[hash];
        if (track) {
            this.fnPool[hash] = Object.assign(Object.assign({}, track), overrides);
        }
        return this.fnPool[hash];
    }
};
exports.default = new FnTracker();
//# sourceMappingURL=tracker.js.map