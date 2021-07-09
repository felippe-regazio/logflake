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
const defaults: MLOptions = {
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

module.exports = (options: MLOptions = defaults): Function => {
  const levels: MLLogLevels = { log: 'cyan', info: 'blue', warn: 'yellow', error: 'red', trace: 'magenta' };

  options = typeof options === 'string' ?
    { ...defaults, prefix: options } :
    { ...defaults, ...options };

  function getDate(): string {
    return ' ' + new Date().toLocaleString(options.dateLocale);
  }

  function getMain(): string {
    const hasMain = require?.main?.filename;
    const info = hasMain && path.parse(require.main.filename);

    return info ? ` (main: ${info.name}${info.ext})` : '';
  }

  function getUsername(): string {
    const userinfo = os.userInfo();
    const username = userinfo.username;
    
    return ` ${username}` || ''; 
  }

  function getPlatform(): string {
    return ` ${process.platform}${options.username ? ':' : ''}` || '';
  }  

  function drawLine(): void {
    let size: number;

    try {
      size = process.stdout.columns / 2;
    } catch(error) {
      size = 50;
    }

    const line = (options.lineChar).repeat(size);
    console.log(chalk.gray(line));
  }

  function header(level: string|null = 'log'): string {
    const color: string = levels[level] || 'cyan';
    const date: string = options.date ? getDate() : '';
    const main: string = options.mainModule ? getMain() : '';
    const platform: string = options.platform ? getPlatform() : '';
    const username: string = options.username ? getUsername() : '';
    const headline: string = `[ ${options.prefix.toUpperCase()} ${level.toUpperCase()} ]`; 

    const header: string = chalk[color].bold(headline) 
      + `${platform}`
      + `${username}`
      + `${main}`
      + `${date}`
      + '\n';

    return header;
  }

  function log(level:string, ...args:any): boolean {
    if (options.disabled) {
      return false;
    }

    if (typeof level !== 'string' || !Object.keys(levels).includes(level)) {
      return log.apply(null, [ 'log', ...[ level, ...args ] ]);
    }

    if (options.seamless) {
      console[level].apply(null, args);
    } else {
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
}