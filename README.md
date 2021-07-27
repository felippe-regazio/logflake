# LogFlake

LogFlake is a NodeJS console logger with superpowers. It has the same API as the usual `Console` but with beautified output, header with timestamp and useful information, trackability and a toolset for better control you application log messages.

```js
/**
 * Here's an example, this will run a beautified console error message, 
 * and automatically save the output on a log file organized by date.
 * You could also tell the logger to save all messages automatically,
 * for example. But in our case, we decided so save only this error:
 */
const logger = require('logflake');
const log = logger({ logDir: './logs' });

log('error', 'Oh no, an error has occurred!').save();
``` 

Output:

```
[ CONSOLE ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM x1 

This is an error message
··························································································
``` 

# Installation

You can install it using `npm` or `yarn`

```bash
npm install logflake
```

or

```bash
yard add logflake
```

# Getting Started

First import LogFlake and create a logger

```js
const logger = require('logflake);
const log = logger();
```

Or if you prefer EJS

```js
import logger from 'logflake';
const log = logger();
```

When using CJS you can use a shorthand

```js
const log = require('logflake')();
```

# Basic Usage

To log a message, you simply do:

```js
log('Hello World');
```

This will output:

```log
[ CONSOLE LOG ] linux: username (main: test.js) 7/24/2021, 11:34:14 PM x1 

Hello world
··························································································
```

You must have noticed the header with useful information. By default, they are:

```
[ CONSOLE LOG ] linux: username (main: test.js) 7/24/2021, 11:34:14 PM x1 
1*              2*     3*       4*              5*                     6*
``` 

1. This is the console prefix or namespace. It shows you a prefix (`CONSOLE` by default) that can be changed by you, followed by the log level (`LOG` by default). You you run a log error with 'TEST' as prefix, for example, this would be `[TEST ERROR]`. The header prefixes are colorized in according to the log level: `{ log: 'blue', info: 'cyan', warn: 'yellow', error: 'red', trace: 'magenta', quiet: 'black' }`.
2. The current Operational System label information.
3. The current O.S. Username information.
4. The current mainfile running.
5. The datetime notation (in `en` by default). You can change the locale on the options.
6. How many times this same log() function has been called at the current runtime/process.

You can disable or enable the items `2, 3, 4, 5, 6` on the `LogFlake` options. 

### The log function

The `log` function API has exactly the same usage of the common `console.log`.  
So, you can do anything you would do with a console.log, for example:

```js
const example = { fizz: 1, buzz: 2 };

log('Hello %s', 'world');
log('This is an object', example);
```

### Console levels

The first `log()` function argument can be used to control the Log Level you want to use.
When you dont specify a level, the `log` level will be used by default. To output an error message:

```js
log('error', 'This is an error message');
```

This will output:

```log
[ CONSOLE ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM x1 

This is an error message
··························································································
```

The usage follows the same usage as a common `console` call:
For example:

```js
const error = new Error('Unexpected error');

log('error', 'An unexpected error has occurred: ', error);
``` 

### Available levels

The console levels are:

```
- log   - simple log message           (prefix blue)
- info  - equivalent to log            (prefix cyan)
- warn  - outputs a warn message       (prefix yellow)
- error - outputs an error message     (prefix red)
- trace - outputs a console trace      (prefix magenta)
- quiet - do not output to current std (no color needed)
```

### Examples

Common Logging:

```js
// common log
log('Im a common log', 'With many arguments', 'and Log level infered');

// info log
log('info', 'Im a info log level and my prefix is cyan');

// warn log
log('warn', 'Im a warning, i have a yellow prefix');
``` 

Logging an error:

```js
const where = 'myfile';

log('error', 'This is an error on %s', where);
```

Outputing a console trace:

```js
log('trace', 'This message will output a trace');
```

Generating a log message in quiet mode:

```js
log('quiet', 'Anything will be outputed on std');
```

# Namespaces

For every `log` function instance you can have a `namespace`. This is simply a `prefix` showed on the console message header.
To change the console namespace (prefix) you can pass a string when creating the `log()` function, or pass it as an option.

### Using namespaces:

You can define a namespace directly when creating the `log()` function: 

```js
const logger = require('logflake');
const log = logger('Hello'); // "HELLO" will be the Namespace

log('Hello world');
log('error', 'This is an error message');
```

Will output:

```log
[ HELLO LOG ] linux: username (main: test.js) 7/24/2021, 11:45:57 PM x1 

Hello world
··························································································
[ HELLO ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM x1 

This is an error message
··························································································
``` 

Note the "Hello" namespace on the log header. Every message logged with the namespaced `log()` function will be prefixed with `HELLO`.

### Defining namespace on options:

You can also pass the namespace by defining the `prefix` option:

```js
const logger = require('logflake');
const log = logger({ prefix: 'Hello' }); // "HELLO" will be the Namespace

log('Hello world');
log('error', 'This is an error message');
```

### Namespace shorthand

If you wont use any other option, and you are using CJS, you can use a shorthand and pass the namespace directly like this:

```js
const log = require('logflake')('Namespace');
```

# Logger Options

There is a plenty of options you can define on your `logger`.  
You must pass the options as an object when calling the `LogFlake` function:

```js
const logger = require('logflake');

const log = logger({ /* options go here */ });
```

For example, to change the namespace, disable the output colors and add a line break after every log, you can do:

```js
const logger = require('logflake');

const log = logger({
  prefix: 'Example',
  colors: false,
  linebreak: true
});

log('info', 'This is an example');
```

### Available Options

| Option | Description | Default |
| --- | --- | --- |
| prefix | Change the log header prefix (namespace) | 'console' | 
| colors | Turn on/off colors on the console output | true |
| header | Turn on/off the log header with further information | true |
| lines | When true, adds a separation line at the end of each log message | true |
| linesChar | The char to be used to build the log separation lines | '·' |
| dateLocale | The header datetime stamp locale. Accepts any JS Locale String | 'en' |
| username | Shows the O.S. username on the log header | true |
| datetime | Shows a datetime stamp on the log header | true |
| platform | Shows the current platform on the log header | true |
| mainModule | Shows the main module on the log header | true |
| disabled | When true, disables all the logs operations on the current instance | false |
| seamless | Dont beautify anything, no further info. Use the common console output | false |
| showLogHash | If true, shows a unique log hash on header of each log message | false |
| alwaysSave | Save all log function instance messages on a file (must set the logDir option) | false |
| alwaysQuiet | Dont output the log messages to the current console (std*) | false |
| logDir | Directory where the logs must saved. They are automatically named | '' |
| format | Any valid option of the node `util.formatWithOptions()` function | {} |
| linebreak | When true, adds a linebreak at the end of each log message | false |

Obs 1. You can check all the `format` available options here: https://nodejs.org/api/util.html#util_util_inspect_object_options  
Obs 2. Every `log()` function call is internally marked with a unique hash, so we can count how many times it was called, for example. 

# Advanced usage

The `log()` function has a chained toolset that allows you to control and change your log behavior.  
To run a log only once inside a loop and save its output on a file, for example, you could do:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs' });

for(let i=0; i<100; i++) {
  log('error', 'Oh no, an error has occurred!')
    .once()
    .save();
}
```

The log above will be fired only once, even inside a loop, and its output will be save on a file inside the folder `logs`. So, the `log()` chain provides chained methods to help you with things like that. Those are the methods:

### Referencing

You can create a "reference" o a log function by assigning it to a variable or const:

```js
// the log will be fired and assigned to a const
const logError = log('Unexpected error');

// the log will be save
logError.save();
```

In the example bellow, the log will be triggered, assigned to the const, then saved. But you can have a situation when you dont want to trigger the log while assigning it to a variable, then you can use quiet as log level, and the `fire()` method to trigger the log. For example:

```js
const logError = log('quiet', 'Unexpected error');

logError.fire('error').save();
``` 

You can see more details about the methods you can use with the log function below.

# Chained Methods

As said, you can use methods chained to you log function to change its behavior. The methods are:

### save

```
save(options?: SaveOptions): chain  
```

Saves the log output to a local file. This method depends of the option: `logDir`. The `logDir` option will specify where the log files must be saved. When calling "save()" a file having the current date as name will be created on the `logDir`. All the logs saved for that day with the current instance will be saved on this file, and so on.  

Usage:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs/' });

// this log message wont be saved
log('Not saved');

// this log message will be saved
log('Will be saved').save();
``` 

When the option `alwaysSave` is true, this method is implicitly called for all log messages. When alwaysSave is true, explicity `save()` callings are ignored to avoid duplication. If you set `{ force: true }` as option, your explicit `save()` methods will be fired even with `alwaysSave` on.  

For example:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs/', alwaysSave: true });

// this log message wont be saved
log('Will be saved A');

// this log message wont be saved 1 time
log('Will be saved B').save();

// this log will be saved 2 times, one
// due the alwaysSave, other due forced save
log('Will be saved C').save({ force: true});
```

The only available option on `save` is `{ force }`.

### once

```
once(): chain  
```

Tells the log to be fired only one time for the current runtime. If you are inside a big for loop, a route on your application and for some reason a unique log is useful for you, or if you just dont want thounsands of duplicated logs, you can use once:

```js
for(let i = 0; i < 1000; i++) {
  // this log will be fired only once
  log('Just one time').once();
}
``` 

The log chain also will occur only once:

```js
for(let i = 0; i < 1000; i++) {
  // this log will be fired and saved only once
  log('Just one time').once().save();
}
```

### get

```
get(callback: Function): chain  
```

Gets the current log function output. This is useful if you want to send you log output to other destinations as a database, slack, telegram, etc. This function accepts a callback that returns the level and the output:

```js
log('error', 'Example').get((level, output) => {
  // level = 'ERROR' // output = The log output
  // do whatever you want with level and output
});
```

For the example above, the level will be `ERROR`, and the output will be the complete log output as string:

``` 
[ CONSOLE ERROR ] linux: username (main: test.js) 7/26/2021, 9:42:49 PM x1 

Example
··························································································
```

### fire

```
fire(level?: string): Log
```

When using a reference, you can use `fire` to trigger the referenced log. When using `fire`, you also gets a new log function. The `level` parameter on this function overrides the original log level. For example:

```js
const logError = log('quiet', 'Unexpected error');

if (someErrorCheck) {
  logError.fire('error'); // log "Unexpected error" x1
}

if (anotherErrorCheck) {
  logError.fire('error'); // log "Unexpected error" x1
}
```

You can also use different log levels for same reference with fire since it returns a new log:

```js
const logGeneric = log('quiet', 'Generic message');

if (someErrorCheck) {
  logError.fire('error'); // log ERROR "Generic message" x1
}

if (anotherErrorCheck) {
  logError.fire('warn'); // log WARN "Generic message" x1
}
```

# About

LogFlake is a `Free and Open Source` package created by Felippe Regazio. Version: 1.0.0.