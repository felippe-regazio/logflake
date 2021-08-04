import tracker from './tracker';
import Helpers from './helpers';

export default class Header {
  private options: Options;
  private helpers: any;

  constructor (options: Options) {
    this.options = options;
    this.helpers = new Helpers(options);
  }
  
  create(level: string|null = 'log', hash: string, colors: boolean = this.options.colors): string {
    const prefix: string = this.getHeaderPrefix(level, colors);
    const info: string = this.getHeaderInfo(level, hash, colors);
    const header: string = `${prefix} ${info}`;

    return level === 'trace' ? `\n${header}` : header;
  }

  getHeaderPrefix(level: string|null = 'log', colors: boolean = this.options.colors) {
    if (level === 'quiet') level = 'log';

    const chalk = this.helpers.getChalk(colors);
    const color: string = this.helpers.getLogLevels()[level] || 'blue';
    const prefix: string  = `[ ${this.options.prefix.toUpperCase()} ${level.toUpperCase()} ]`;
    
    return chalk[color].bold(prefix);
  }

  getHeaderInfo(level: string|null = 'log', hash: string, colors: boolean = this.options.colors): string {
    const _track  = tracker.read(hash);
    const _levels = this.helpers.getLogLevels();
    const _chalk = this.helpers.getChalk(colors);
    const _painter = this.options.headerTextColor ? _chalk[this.options.headerTextColor] : (str: string) => str;

    const color: string     = _levels[level] || 'blue';
    const loghash: string   = this.options.showLogHash && ` ${_track.hash}`;
    const platform: string  = this.options.platform    && this.helpers.getPlatform();
    const username: string  = this.options.username    && this.helpers.getUsername();
    const main: string      = this.options.mainModule  && this.helpers.getMain();
    const date: string      = this.options.datetime    && this.helpers.getDateTime();
    const callCount: string = this.options.callCount   && _chalk[color](this.helpers.getCallCountStr(_track));

    const info = [
      platform,
      username,
      main,
      date,
      callCount,
      loghash
    ]
      .filter(item => item)
      .join(' ');

    return _painter(info);
  }
}