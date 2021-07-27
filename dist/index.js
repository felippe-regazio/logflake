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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var tracker_1 = __importDefault(require("./tracker"));
var helpers_1 = __importDefault(require("./helpers"));
var output_1 = __importDefault(require("./output"));
var defaults = {
    prefix: 'console',
    colors: true,
    header: true,
    lines: true,
    linesChar: '·',
    dateLocale: 'en',
    username: true,
    datetime: true,
    platform: true,
    mainModule: true,
    disabled: false,
    seamless: false,
    showLogHash: false,
    alwaysSave: false,
    alwaysQuiet: false,
    logDir: '',
    format: {},
    linebreak: false,
};
module.exports = function (options) {
    if (options === void 0) { options = defaults; }
    options = typeof options === 'string' ? __assign(__assign({}, defaults), { prefix: options }) : __assign(__assign({}, defaults), options);
    var _output = new output_1.default(options);
    var _helpers = new helpers_1.default(options);
    function log(level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var logLevels = _helpers.getLogLevels();
        if (typeof level !== 'string' || !Object.keys(logLevels).includes(level)) {
            return log.apply(null, __spreadArray(['log'], __spreadArray([level], args)));
        }
        if (options.disabled) {
            return _helpers.noopChain(chain);
        }
        var track = tracker_1.default.fnTrack();
        if (track.fnDisabled) {
            return _helpers.noopChain(chain);
        }
        if (!options.alwaysQuiet && level !== 'quiet') {
            _output.printf(level, args, track.hash);
        }
        var _chain = chain(level, args, track.hash);
        return options.alwaysSave ? _chain.save() : _chain;
    }
    function chain(level, argc, hash) {
        var chalk = _helpers.getChalk();
        var keepChain = function () { return chain(level, argc, hash); };
        return {
            save: function () {
                options.logDir ?
                    _output.save(path_1.default.resolve(options.logDir), level, argc, hash) :
                    console.trace(chalk.yellow('(!) Could not save the log. The "logDir" option is missing.'));
                return keepChain();
            },
            once: function () {
                tracker_1.default.mutateFnTrack(hash, { fnDisabled: true });
                return keepChain();
            },
            reset: function () {
                tracker_1.default.mutateFnTrack(hash, {
                    callCount: 0,
                    fnDisabled: false,
                });
                return keepChain();
            },
            disabled: function (is) {
                if (is === void 0) { is = true; }
                tracker_1.default.mutateFnTrack(hash, { fnDisabled: is });
                return keepChain();
            },
            get: function (cb, colors) {
                if (colors === void 0) { colors = false; }
                cb && cb(level, _output.getOutput(level, argc, hash, colors));
                return keepChain();
            },
            fire: function (_level) {
                if (_level === void 0) { _level = level; }
                return log.apply(void 0, __spreadArray([_level], argc));
            }
        };
    }
    return log;
};
//# sourceMappingURL=index.js.map