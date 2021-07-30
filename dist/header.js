"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tracker_1 = __importDefault(require("./tracker"));
var helpers_1 = __importDefault(require("./helpers"));
var Header = (function () {
    function Header(options) {
        this.options = options;
        this.helpers = new helpers_1.default(options);
    }
    Header.prototype.create = function (level, hash, colors) {
        if (level === void 0) { level = 'log'; }
        if (colors === void 0) { colors = this.options.colors; }
        if (level === 'quiet')
            level = 'log';
        var _chalk = this.helpers.getChalk(colors);
        var _track = tracker_1.default.read(hash);
        var _levels = this.helpers.getLogLevels();
        var color = _levels[level] || 'blue';
        var headline = "[ " + this.options.prefix.toUpperCase() + " " + level.toUpperCase() + " ]";
        var platform = this.options.platform ? this.helpers.getPlatform() : '';
        var username = this.options.username ? this.helpers.getUsername() : '';
        var main = this.options.mainModule ? this.helpers.getMain() : '';
        var date = this.options.datetime ? this.helpers.getDateTime() : '';
        var callCount = this.options.callCount ? _chalk[color](this.helpers.getCallCountStr(_track)) : '';
        var loghash = this.options.showLogHash ? _chalk.gray(" " + _track.hash) : '';
        var header = _chalk[color].bold(headline)
            + ("" + platform)
            + ("" + username)
            + ("" + main)
            + ("" + date)
            + ("" + callCount)
            + ("" + loghash);
        return level === 'trace' ? "\n" + header : header;
    };
    Header.prototype.getCallCountStr = function () {
    };
    return Header;
}());
exports.default = Header;
//# sourceMappingURL=header.js.map