import os from 'os';
import path from 'path';
import chalk from 'chalk';

export default class Helpers {
  private options: Options;

  constructor (options: Options) {
    this.options = options;
  }

  getChalk(colors: boolean = this.options.colors): any {
    return new chalk.Instance({ level: colors ? 2 : 0 });
  }

  getLogLevels(): LogLevels {
    return {
      log: 'blue',
      info: 'cyan',
      warn: 'yellow',
      error: 'red',
      trace: 'magenta',
      quiet: 'black',
    }
  }

  getDateTime(): string {
    return ' ' + new Date().toLocaleString(this.options.dateLocale);
  }

  getMain(): string {
    const hasMain = require?.main?.filename;
    const info = hasMain && path.parse(require.main.filename);

    return info ? ` (main: ${info.name}${info.ext})` : '';
  }

  getUsername(): string {
    const userinfo = os.userInfo();
    const username = userinfo.username;
    
    return username ? ` ${username}` : ''; 
  }

  getPlatform(): string {
    const platform = process.platform;
    const separator = this.options.username ? ':' : '';

    return platform ? ` ${platform}${separator}` : '';
  }

  line(colors: boolean = this.options.colors): string {
    let size: number;

    try {
      size = process.stdout.columns / 2;
    } catch(error) {
      size = 50;
    }

    const _chalk = this.getChalk(colors);
    const _line = (this.options.linesChar).repeat(size);

    return _chalk.gray(_line);
  }
  
  getEnDateStr(): string {
    return new Date().toISOString()
      .replace(/T.*/,'')
      .split('-')
      .reverse()
      .join('-');
  }

  noopChain(chain: Function): Chain {
    const noop = chain();

    Object.keys(noop).forEach(fn => {
      noop[fn] = () => noop();
    });

    return noop;
  }
}