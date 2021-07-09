const os = require("os");
const path = require('path');
const chalk = require('chalk');
/**
 * This is a simple lib for better, controled and beautiful console outputs
 * This is intended to be simple and small, so dont overengineering it please
 *
 * @author Felippe Regazio
 * @param {MLOptions|string} options
 * @returns {function}
 */
const defaults = {
    prefix: 'console',
    lines: true,
    lineChar: '·',
    dateLocale: 'en',
    username: true,
    date: true,
    platform: true,
    mainModule: true,
    disabled: false,
    seamless: false,
};
module.exports = (options = defaults) => {
    const levels = { log: 'cyan', info: 'blue', warn: 'yellow', error: 'red', trace: 'magenta' };
    options = typeof options === 'string' ? Object.assign(Object.assign({}, defaults), { prefix: options }) : Object.assign(Object.assign({}, defaults), options);
    function getDate() {
        return ' ' + new Date().toLocaleString(options.dateLocale);
    }
    function getMain() {
        var _a;
        const hasMain = (_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename;
        const info = hasMain && path.parse(require.main.filename);
        return info ? ` (main: ${info.name}${info.ext})` : '';
    }
    function getUsername() {
        const userinfo = os.userInfo();
        const username = userinfo.username;
        return ` ${username}` || '';
    }
    function getPlatform() {
        return ` ${process.platform}${options.username ? ':' : ''}` || '';
    }
    function drawLine() {
        let size;
        try {
            size = process.stdout.columns / 2;
        }
        catch (error) {
            size = 50;
        }
        const line = (options.lineChar).repeat(size);
        console.log(chalk.gray(line));
    }
    function header(level = 'log') {
        const color = levels[level] || 'cyan';
        const date = options.date ? getDate() : '';
        const main = options.mainModule ? getMain() : '';
        const platform = options.platform ? getPlatform() : '';
        const username = options.username ? getUsername() : '';
        const headline = `[ ${options.prefix.toUpperCase()} ${level.toUpperCase()} ]`;
        const header = chalk[color].bold(headline)
            + `${platform}`
            + `${username}`
            + `${main}`
            + `${date}`
            + '\n';
        return header;
    }
    function log(level, ...args) {
        if (options.disabled) {
            return false;
        }
        if (typeof level !== 'string' || !Object.keys(levels).includes(level)) {
            return log.apply(null, ['log', ...[level, ...args]]);
        }
        if (options.seamless) {
            console[level].apply(null, args);
        }
        else {
            options.lines && drawLine();
            // -------------------------------
            console.log(header(level));
            console[level].apply(null, args);
            // -------------------------------
            options.lines && drawLine();
        }
        return true;
    }
    return log;
};
//# sourceMappingURL=index.js.map