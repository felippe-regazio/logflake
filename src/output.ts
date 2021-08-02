import fs from 'fs';
import util from 'util';
import Helpers from './helpers';
import Header from './header';

export default class Output {
  private options: Options;
  private helpers: any;

  constructor (options: Options) {
    this.options = options;
    this.helpers = new Helpers(options);
  }

  printf(level: string, args: Array<any>, hash: string, colors: boolean = this.options.colors, consoleInstance: Console = console): string {
    const content: string = this.getOutput(level, args, hash, colors);
    consoleInstance[level](content);

    this.options.lines && 
      consoleInstance.log(this.helpers.line(colors));
    
    this.options.linebreak && 
      consoleInstance.log('');

    return content;
  }  

  getOutput(level: string, args: any, hash: string, colors: boolean = this.options.colors): string {
    const result = [];
    
    if (this.options.seamless) {
      result.push(...args);
    } else {
      const header = new Header(this.options).create(level, hash, colors);
      const content = this.formatter(args, colors);
      // ---------------------------------------------
      this.options.header && result.push(header);
      result.push(`\n\n${content}`);
      // ---------------------------------------------
    }

    return this.formatter(result);
  }

  formatter(args: Array<any>, colors: boolean = this.options.colors): string {
    const formatOptions: any = { ...this.options.format, ...{ colors } };
    
    return util.formatWithOptions.apply(null, [ formatOptions, ...args ]);
  }

  save(dest: string, level:string, args: Array<any>, hash: string): void {
    if (level === 'quiet') { level = 'log' }
    
    const chalk = this.helpers.getChalk();
    const stream = fs.createWriteStream(`${dest}/${this.helpers.getDateStr()}.log`, { flags: 'a' });
    const customConsole = new console.Console({ stdout: stream, stderr: stream });
    
    stream.on('error', error => {
      console.error(chalk.yellow('(!) Could not save the log. Error: \n'));
      console.error(error);
    });
    
    setTimeout(() => this.printf(level, args, hash, false, customConsole), 200);
  }  
}