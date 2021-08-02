"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var Helpers = (function () {
    function Helpers(options) {
        this.options = options;
    }
    Helpers.prototype.getChalk = function (colors) {
        if (colors === void 0) { colors = this.options.colors; }
        return new chalk_1.default.Instance({ level: colors ? 2 : 0 });
    };
    Helpers.prototype.getLogLevels = function () {
        return {
            log: 'blue',
            info: 'cyan',
            warn: 'yellow',
            error: 'red',
            trace: 'magenta',
            quiet: 'black',
        };
    };
    Helpers.prototype.getDateTime = function (dateLocale) {
        return ' ' + new Date().toLocaleString(dateLocale || this.options.dateLocale);
    };
    Helpers.prototype.getMain = function () {
        var _a;
        var hasMain = (_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename;
        var info = hasMain && path_1.default.parse(require.main.filename);
        return info ? " (main: " + info.name + info.ext + ")" : '';
    };
    Helpers.prototype.getUsername = function () {
        var userinfo = os_1.default.userInfo();
        var username = userinfo.username;
        return username ? " " + username : '';
    };
    Helpers.prototype.getPlatform = function () {
        var platform = process.platform;
        var separator = this.options.username ? ':' : '';
        return platform ? " " + platform + separator : '';
    };
    Helpers.prototype.getCallCountStr = function (track) {
        var callCount = ' x' + (track.callCount || '(?)');
        if (track.callCount === Number.MAX_SAFE_INTEGER) {
            callCount += ' (+)';
        }
        return callCount;
    };
    Helpers.prototype.line = function (colors) {
        if (colors === void 0) { colors = this.options.colors; }
        var size;
        try {
            size = process.stdout.columns / 2;
        }
        catch (error) {
            size = 50;
        }
        var _chalk = this.getChalk(colors);
        var _line = (this.options.linesChar).repeat(size);
        return _chalk.gray(_line);
    };
    Helpers.prototype.getDateStr = function () {
        var date = new Date();
        var day = date.getDate();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        return year + "-" + month + "-" + day;
    };
    Helpers.prototype.noopChain = function (chain) {
        var noop = chain();
        Object.keys(noop).forEach(function (fn) {
            noop[fn] = function () { return noop; };
        });
        return noop;
    };
    return Helpers;
}());
exports.default = Helpers;
//# sourceMappingURL=helpers.js.map