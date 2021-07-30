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
    if (level === 'quiet') level = 'log';
    
    const _chalk  = this.helpers.getChalk(colors);
    const _track  = tracker.read(hash);
    const _levels = this.helpers.getLogLevels();

    const color: string     = _levels[level] || 'blue';
    const headline: string  = `[ ${this.options.prefix.toUpperCase()} ${level.toUpperCase()} ]`;
    const platform: string  = this.options.platform ? this.helpers.getPlatform() : '';
    const username: string  = this.options.username ? this.helpers.getUsername() : '';
    const main: string      = this.options.mainModule ? this.helpers.getMain() : '';
    const date: string      = this.options.datetime ? this.helpers.getDateTime() : '';
    const callCount: string = this.options.callcount ? _chalk[color](` x${(_track.callCount || '(?)')}`) : '';
    const loghash: string   = this.options.showLogHash ? _chalk.gray(` ${_track.hash}`) : '';

    const header: string = _chalk[color].bold(headline)
      + `${platform}`
      + `${username}`
      + `${main}`
      + `${date}`
      + `${callCount}`
      + `${loghash}`;

    return level === 'trace' ? `\n${header}` : header;
  }  
}