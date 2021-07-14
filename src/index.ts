import os from 'os';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import tracker from './tracker';

/**
 * This is a simple lib for better, controled and beautiful console outputs 
 * This is intended to be simple and small, so dont overengineering it please
 * 
 * @author Felippe Regazio
 * @param {Options|string} options 
 * @returns {function}
 */
const defaults: Options = {
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

module.exports = (options: Options = defaults): Function => {
  const levels: LogLevels = {
    log: 'blue',
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    trace: 'magenta',
    quiet: 'black',
  };

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

  function line(): string {
    let size: number;

    try {
      size = process.stdout.columns / 2;
    } catch(error) {
      size = 50;
    }

    const line = (options.lineChar).repeat(size);    
    return chalk.gray(line);
  }

  function header(level: string|null = 'log', track: FnTrack, colors: any = 2): string {
    const _chalk = new chalk.Instance({ level: colors });

    const color: string = levels[level] || 'cyan';
    const headline: string = `[ ${options.prefix.toUpperCase()} ${level.toUpperCase()} ]`;
    const platform: string = options.platform ? getPlatform() : '';
    const username: string = options.username ? getUsername() : '';
    const main: string = options.mainModule ? getMain() : '';
    const date: string = options.date ? getDate() : '';
    const callCount: string = _chalk[color](` x${(track.callCount || 'unknown')}`);
    const loghash: string = options.showLogHash ? _chalk.gray(` ${track.hash}`) : '';

    const header: string = _chalk[color].bold(headline) 
      + `${platform}`
      + `${username}`
      + `${main}`
      + `${date}`
      + `${callCount}`
      + `${loghash}`
      + '\n';

    return header;
  }

  function save(dest: string, level:string, argc: any): void {
    if (level === 'quiet') { level = 'log' }

    // fileName is date in en mm-dd-yyyy format
    const fileName = new Date().toISOString()
      .replace(/T.*/,'')
      .split('-')
      .reverse()
      .join('-');

    // create a writeable stream in append mode pointing to dest file
    const stream = fs.createWriteStream(`${dest}/${fileName}.log`, { flags: 'a' });
    // create a new console instance and point its output to our stream 
    const _console = new console.Console({ stdout: stream, stderr: stream });
    // trigger the custom console
    setTimeout(() => { _console[level].apply(null, argc) }, 200);
  }

  function chain(level?: string, argc?: any, hash?: string): Chain {
    return {
      save: (): Chain => {
        if (options.logDir.trim()) {
          const _track = tracker.read(hash); 
          const _dest: string = path.resolve(options.logDir);
          const _header: string = `>>>>> ${header(level, _track, 0)}`;
          const _br: string = options.linebreak ? '\n' : '';

          save(_dest, level, [ _header, ...argc, _br ]);
        } else {
          console.warn('(!) Could not save the log. The option "logDir" is missing.');
        }

        return chain(level, argc, hash);
      },
      
      once: (): Chain => {
        tracker.mutateFnTrack(hash, { fnDisabled: true });
        
        return chain(level, argc, hash);
      },

      reset: (): Chain => {
        tracker.mutateFnTrack(hash, {
          callCount: 0,
          fnDisabled: false,
        });
        
        return chain(level, argc, hash);
      },

      disabled: (is: boolean = true): Chain => {
        tracker.mutateFnTrack(hash, { fnDisabled: is });

        return chain(level, argc, hash);
      },

      fire: (_level: string = level): Chain => {
        return log(_level, ...argc);
      }
    }
  }

  function noop(): Chain {
    return {
      save: () => noop(),
      once: () => noop(),
      reset: () => noop(),
      fire: () => noop(),
      disabled: () => noop(),
    }
  }

  function log(level:string, ...args:any): Chain {
    if (typeof level !== 'string' || !Object.keys(levels).includes(level)) {
      return log.apply(null, [ 'log', ...[ level, ...args ] ]);
    }

    if (options.disabled) {
      return noop();
    }

    const track: FnTrack = tracker.fnTrack();
    const _chain = chain(level, args, track.hash);
    const _log: Function = () => console[level].apply(null, args);

    if (track.fnDisabled) {
      return noop();
    }

    if (!options.alwaysQuiet && level !== 'quiet') {
      if(options.seamless) {
        _log();
      } else {
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
}