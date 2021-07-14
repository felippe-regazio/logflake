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
    alwaysQuiet: false,
    logDir: '',
    linebreak: true,
};
module.exports = (options = defaults) => {
    const levels = {
        log: 'blue',
        info: 'cyan',
        warn: 'yellow',
        error: 'red',
        trace: 'magenta',
        quiet: 'black',
    };
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
    function save(dest, level, argc) {
        if (level === 'quiet') {
            level = 'log';
        }
        // fileName is date in en mm-dd-yyyy format
        const fileName = new Date().toISOString()
            .replace(/T.*/, '')
            .split('-')
            .reverse()
            .join('-');
        // create a writeable stream in append mode pointing to dest file
        const stream = fs_1.default.createWriteStream(`${dest}/${fileName}.log`, { flags: 'a' });
        // create a new console instance and point its output to our stream 
        const _console = new console.Console({ stdout: stream, stderr: stream });
        // trigger the custom console
        setTimeout(() => { _console[level].apply(null, argc); }, 200);
    }
    function chain(level, argc, hash) {
        return {
            save: () => {
                if (options.logDir.trim()) {
                    const _track = tracker_1.default.read(hash);
                    const _dest = path_1.default.resolve(options.logDir);
                    const _header = `>>>>> ${header(level, _track, 0)}`;
                    const _br = options.linebreak ? '\n' : '';
                    save(_dest, level, [_header, ...argc, _br]);
                }
                else {
                    console.warn('(!) Could not save the log. The option "logDir" is missing.');
                }
                return chain(level, argc, hash);
            },
            once: () => {
                tracker_1.default.mutateFnTrack(hash, { fnDisabled: true });
                return chain(level, argc, hash);
            },
            reset: () => {
                tracker_1.default.mutateFnTrack(hash, {
                    callCount: 0,
                    fnDisabled: false,
                });
                return chain(level, argc, hash);
            },
            disabled: (is = true) => {
                tracker_1.default.mutateFnTrack(hash, { fnDisabled: is });
                return chain(level, argc, hash);
            },
            fire: (_level = level) => {
                return log(_level, ...argc);
            }
        };
    }
    function noop() {
        return {
            save: () => noop(),
            once: () => noop(),
            reset: () => noop(),
            fire: () => noop(),
            disabled: () => noop(),
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
        const _chain = chain(level, args, track.hash);
        const _log = () => console[level].apply(null, args);
        if (track.fnDisabled) {
            return noop();
        }
        if (!options.alwaysQuiet && level !== 'quiet') {
            if (options.seamless) {
                _log();
            }
            else {
                options.lines && console.log(line());
                // -------------------------------
                console.log(`${header(level, track)}`);
                console.group();
                _log();
                console.groupEnd();
                // -------------------------------
                options.lines && console.log(line());
                options.linebreak && console.log('');
            }
        }
        return options.alwaysSave ? _chain.save() : _chain;
    }
    return log;
};
//# sourceMappingURL=index.js.map