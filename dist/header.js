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
        var prefix = this.getHeaderPrefix(level, colors);
        var info = this.getHeaderInfo(level, hash, colors);
        var header = prefix + " " + info;
        return level === 'trace' ? "\n" + header : header;
    };
    Header.prototype.getHeaderPrefix = function (level, colors) {
        if (level === void 0) { level = 'log'; }
        if (colors === void 0) { colors = this.options.colors; }
        if (level === 'quiet')
            level = 'log';
        var chalk = this.helpers.getChalk(colors);
        var color = this.helpers.getLogLevels()[level] || 'blue';
        var prefix = "[ " + this.options.prefix.toUpperCase() + " " + level.toUpperCase() + " ]";
        return chalk[color].bold(prefix);
    };
    Header.prototype.getHeaderInfo = function (level, hash, colors) {
        if (level === void 0) { level = 'log'; }
        if (colors === void 0) { colors = this.options.colors; }
        var _track = tracker_1.default.read(hash);
        var _levels = this.helpers.getLogLevels();
        var _chalk = this.helpers.getChalk(colors);
        var _painter = this.options.headerTextColor ? _chalk[this.options.headerTextColor] : function (str) { return str; };
        var color = _levels[level] || 'blue';
        var loghash = this.options.showLogHash && " " + _track.hash;
        var platform = this.options.platform && this.helpers.getPlatform();
        var username = this.options.username && this.helpers.getUsername();
        var main = this.options.mainModule && this.helpers.getMain();
        var date = this.options.datetime && this.helpers.getDateTime();
        var callCount = this.options.callCount && _chalk[color](this.helpers.getCallCountStr(_track));
        var info = [
            platform,
            username,
            main,
            date,
            callCount,
            loghash
        ]
            .filter(function (item) { return item; })
            .join(' ');
        return _painter(info);
    };
    return Header;
}());
exports.default = Header;
//# sourceMappingURL=header.js.map