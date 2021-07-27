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
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var helpers_1 = __importDefault(require("./helpers"));
var header_1 = __importDefault(require("./header"));
var Output = (function () {
    function Output(options) {
        this.options = options;
        this.helpers = new helpers_1.default(options);
    }
    Output.prototype.printf = function (level, args, hash, colors, consl) {
        if (colors === void 0) { colors = this.options.colors; }
        if (consl === void 0) { consl = console; }
        var content = this.getOutput(level, args, hash, colors);
        consl[level](content);
        this.options.lines &&
            consl.log(this.helpers.line(colors));
        this.options.linebreak &&
            consl.log('');
    };
    Output.prototype.getOutput = function (level, args, hash, colors) {
        if (colors === void 0) { colors = this.options.colors; }
        var result = [];
        if (this.options.seamless) {
            result.push.apply(result, args);
        }
        else {
            var header = new header_1.default(this.options).create(level, hash, colors);
            var content = this.formatter(args, colors);
            this.options.header && result.push(header);
            result.push("\n\n" + content);
        }
        return this.formatter(result);
    };
    Output.prototype.formatter = function (args, colors) {
        if (colors === void 0) { colors = this.options.colors; }
        var formatOptions = __assign(__assign({}, this.options.format), { colors: colors });
        return util_1.default.formatWithOptions.apply(null, __spreadArray([formatOptions], args));
    };
    Output.prototype.save = function (dest, level, args, hash) {
        var _this = this;
        if (level === 'quiet') {
            level = 'log';
        }
        var chalk = this.helpers.getChalk();
        var stream = fs_1.default.createWriteStream(dest + "/" + this.helpers.getEnDateStr() + ".log", { flags: 'a' });
        var customConsole = new console.Console({ stdout: stream, stderr: stream });
        stream.on('error', function (error) {
            console.error(chalk.yellow('(!) Could not save the log. Error: \n'));
            console.error(error);
        });
        setTimeout(function () { return _this.printf(level, args, hash, false, customConsole); }, 200);
    };
    return Output;
}());
exports.default = Output;
//# sourceMappingURL=output.js.map