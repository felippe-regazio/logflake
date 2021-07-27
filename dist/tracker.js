"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = __importDefault(require("md5"));
var FnTracker = (function () {
    function class_1() {
        this.fnPool = {};
    }
    class_1.prototype.fnTrack = function () {
        var hash = this.fnCreateHash();
        var fnTrack = this.fnPool[hash] || {};
        var callCount = fnTrack.callCount ? ++fnTrack.callCount : 1;
        if (!fnTrack || fnTrack.fnDisabled !== true) {
            Object.assign(fnTrack, {
                hash: hash,
                callCount: callCount,
                fnDisabled: fnTrack.fnDisabled,
            });
        }
        this.fnPool[hash] = fnTrack;
        return fnTrack;
    };
    class_1.prototype.fnCreateHash = function () {
        var _stl = Error.stackTraceLimit;
        Error.stackTraceLimit = 1000;
        var trace = new Error().stack;
        Error.stackTraceLimit = _stl;
        return md5_1.default(trace);
    };
    class_1.prototype.mutateFnTrack = function (hash, overrides) {
        var track = this.fnPool[hash];
        if (track) {
            this.fnPool[hash] = __assign(__assign({}, track), overrides);
        }
        return this.fnPool[hash];
    };
    class_1.prototype.read = function (hash) {
        return this.fnPool[hash];
    };
    return class_1;
}());
exports.default = new FnTracker();
//# sourceMappingURL=tracker.js.map