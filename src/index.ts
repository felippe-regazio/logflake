import path from 'path';
import tracker from './tracker';
import Helpers from './helpers';
import Output from './output';

const defaults: Options = {
  prefix: 'console',
  colors: true,
  header: true,
  lines: true,
  linesChar: '·',
  dateLocale: 'en',
  username: true,
  datetime: true,
  platform: true,
  mainModule: true,
  disabled: false,
  seamless: false,
  showLogHash: false,
  alwaysSave: false,
  alwaysQuiet: false,
  logDir: '',
  format: {},
  linebreak: false,
};

/**
 * This factory returns a "log" function which has the same API than a Console. 
 * The "log" function accepts two params, log([level], args). WHen the first one 
 * is a level param, it changes the log level, style or behavior, otherwise, all
 * the params will be used to construct the log output message. This factory
 * accepts a set of options which can be a string or an object.
 * 
 * Options as String: will change the Log output namespace on the header info
 * Options as Object: can be useful to set and motify a lot of thigs
 * For further information, check the complete documentation on the package repo.
 * 
 * @author  Felippe Regazio
 * @param   {Options|string} options Can be an string or Options object 
 * @returns {function}       Returns a log function with chained methods
 */
module.exports = (options: Options = defaults): Function => {
  options = typeof options === 'string' ?
    { ...defaults, prefix: options } :
    { ...defaults, ...options };

  const _output = new Output(options);
  const _helpers = new Helpers(options);

  /**
   * This is a log function with same API as Console. The first param can be a valid log level,
   * to change the log style and output behavior. By default, every log has a header with
   * useful information about the Event, environment and the log self; the message constructed 
   * from the arguments passed by you; and a Chain of useful modifiers. Ex:
   * 
   * log('A message')                 Is equivalent to console.log('Im a message');
   * log('error', 'A message')        Is equivalent to console.error('Im A message');
   * log('A', 'message')              Is equivalent to console.log('A', 'message');
   * log('trace', 'A %s', 'message')  Is equivalent to console.trace('A %s', 'message');
   * 
   * @param   {string} level This is optional, can be [log|info|warn|error|trace|quiet]
   * @param   {any}    args  Any kind or number of args with exaclty same api as Console
   * @returns {Chain}  A chain of methods to change/control the log behavior 
   */
  function log(level:string, ...args:any): Chain {
    const logLevels = _helpers.getLogLevels();

    if (typeof level !== 'string' || !Object.keys(logLevels).includes(level)) {
      return log.apply(null, [ 'log', ...[ level, ...args ] ]);
    }
    
    if (options.disabled) {
      return _helpers.noopChain(chain);
    }

    const track: FnTrack = tracker.fnTrack();

    if (track.fnDisabled) {
      return _helpers.noopChain(chain);
    }
    
    if (!options.alwaysQuiet && level !== 'quiet') {
      _output.printf(level, args, track.hash);
    }
    
    const _chain = chain(level, args, track.hash);
    return options.alwaysSave ? _chain.save({ force: true }) : _chain;
  }  

  /**
   * This factory returns a Chain that uses the same parameters passed to the Log (parent)
   * function to modify and control the subsequent behavior. Each methods always return the
   * same Chain passed the last params to the next one, allowing infinite modifiers chaining.
   * 
   * @param   {string} level the level passed or infered from log() fn 
   * @param   {any}    argc  the args passed to the log() fn
   * @param   {string} hash  the hash generated by the tracker on the log() fn
   * @returns {Chain}        a chain of methods to control and modify the log flow
   */
  function chain(level?: string, argc?: Array<any>, hash?: string): Chain {
    const chalk = _helpers.getChalk();
    const keepChain = () => chain(level, argc, hash);

    return {
      save: (saveOpts: SaveOptions = {}): Chain => {
        const mustSave = !options.alwaysSave || (options.alwaysSave && saveOpts.force);

        options.logDir && mustSave ?
          _output.save(path.resolve(options.logDir), level, argc, hash) :
          console.trace(chalk.yellow('(!) Could not save the log. The "logDir" option is missing.'));
        
        return keepChain();
      },
      
      once: (): Chain => {
        tracker.mutateFnTrack(hash, { fnDisabled: true });
        
        return keepChain();
      },

      reset: (): Chain => {
        tracker.mutateFnTrack(hash, {
          callCount: 0,
          fnDisabled: false,
        });
        
        return keepChain();
      },

      disabled: (is: boolean = true): Chain => {
        tracker.mutateFnTrack(hash, { fnDisabled: is });

        return keepChain();
      },

      get: (cb: Function, colors: boolean = false) => {
        cb && cb(level, _output.getOutput(level, argc, hash, colors));

        return keepChain();
      },

      fire: (_level: string = level): Chain => {
        return log(_level, ...argc);
      }      
    }
  }

  return log;
}