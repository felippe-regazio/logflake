"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const tracker_1 = __importDefault(require("./tracker"));
/**
 * This is a simple lib for better, controled and beautiful console outputs
 * This is intended to be simple and small, so dont overengineering it please
 *
 * @author Felippe Regazio
 * @param {Options|string} options
 * @returns {function}
 */
const defaults = {
    prefix: 'console',
    lines: false,
    lineChar: '·',
    dateLocale: 'en',
    username: true,
    date: true,
    platform: true,
    mainModule: true,
    disabled: false,
    seamless: false,
    showLogHash: false,
    alwaysSave: false,
    logDir: '',
};
module.exports = (options = defaults) => {
    const levels = { log: 'blue', info: 'cyan', warn: 'yellow', error: 'red', trace: 'magenta' };
    options = typeof options === 'string' ? Object.assign(Object.assign({}, defaults), { prefix: options }) : Object.assign(Object.assign({}, defaults), options);
    function getDate() {
        return ' ' + new Date().toLocaleString(options.dateLocale);
    }
    function getMain() {
        var _a;
        const hasMain = (_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename;
        const info = hasMain && path_1.default.parse(require.main.filename);
        return info ? ` (main: ${info.name}${info.ext})` : '';
    }
    function getUsername() {
        const userinfo = os_1.default.userInfo();
        const username = userinfo.username;
        return ` ${username}` || '';
    }
    function getPlatform() {
        return ` ${process.platform}${options.username ? ':' : ''}` || '';
    }
    function line() {
        let size;
        try {
            size = process.stdout.columns / 2;
        }
        catch (error) {
            size = 50;
        }
        const line = (options.lineChar).repeat(size);
        return chalk_1.default.gray(line);
    }
    function header(level = 'log', track, colors = 2) {
        const _chalk = new chalk_1.default.Instance({ level: colors });
        const color = levels[level] || 'cyan';
        const headline = `[ ${options.prefix.toUpperCase()} ${level.toUpperCase()} ]`;
        const platform = options.platform ? getPlatform() : '';
        const username = options.username ? getUsername() : '';
        const main = options.mainModule ? getMain() : '';
        const date = options.date ? getDate() : '';
        const callCount = _chalk[color](` x${(track.callCount || 'unknown')}`);
        const loghash = options.showLogHash ? _chalk.gray(` ${track.hash}`) : '';
        const header = _chalk[color].bold(headline)
            + `${platform}`
            + `${username}`
            + `${main}`
            + `${date}`
            + `${callCount}`
            + `${loghash}`
            + '\n';
        return header;
    }
    function save(level, argc) {
        setTimeout(() => {
            // create a writeable stream in append mode
            const stream = fs_1.default.createWriteStream('./out.log', { flags: 'a' });
            const stdout = stream;
            const stderr = stream;
            // create a new console instance and point its output to our stream 
            const _console = new console.Console({ stdout, stderr });
            _console[level].apply(null, argc);
        }, 200);
    }
    function chain(level, argc, track) {
        return {
            save: () => {
                const _header = `>>>>> ${header(level, track, 0)}`;
                save(level, [_header, ...argc]);
                return chain(level, argc, track);
            },
            once: () => {
                track && tracker_1.default.mutateFnTrack(track.hash, {
                    fnDisabled: true,
                    once: true
                });
                return chain(level, argc, track);
            }
        };
    }
    function noop() {
        return {
            save: () => noop(),
            once: () => noop(),
        };
    }
    function log(level, ...args) {
        if (typeof level !== 'string' || !Object.keys(levels).includes(level)) {
            return log.apply(null, ['log', ...[level, ...args]]);
        }
        if (options.disabled) {
            return noop();
        }
        const track = tracker_1.default.fnTrack();
        const _log = () => console[level].apply(null, args);
        if (track.fnDisabled) {
            return noop();
        }
        if (options.seamless) {
            _log();
        }
        else {
            options.lines && console.log(line());
            // -------------------------------
            console.log(`${header(level, track)}`);
            _log();
            // -------------------------------
            options.lines && console.log(line());
        }
        return chain(level, args, track);
    }
    return log;
};
//# sourceMappingURL=index.js.map