# LogFlake

LogFlake is a NodeJS Logger with superpowers. It has the same API as the usual `Console` but with beautified output, a message header with timestamp and useful information, trackability and a toolset for a better control of your efemeral or persistent log messages.

```js
const logger = require('logflake');
const log = logger({ logDir: './logs' });

log('error', 'This is an error message').save();
``` 

Console message output example:

```
[ CONSOLE ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM

This is an error message
········································································
``` 

# Installing

You can install using `npm` or `yarn`

```bash
npm install logflake
```

or

```bash
yarn add logflake
```

# Examples

Here are some examples of the Logflake Super Powers.

### Common Logging

The Console API remains the same:

```js
const log = require('log')();

log('Same', 'Console', 'API', this);

log('Wellcome %s', 'dev');

log('warn', 'Oh no, this is a waning');

log('error', 'Oh no, an error has occurred!');

log('info', process.env);
``` 

### Saving to files

You can save log output on disk, the files willl be automatically organized by date:

```js 
const log = require('logflake')({ logDir: './logs' });

log('error', 'This is an error message').save();
log('warn', 'Oh no, this is a waning').save();

```

### Sending to Slack

LogFlake allows you to send logs directly from runtime to Slack:

```js
const log = require('logflake')({ slackWebHookUrl: '<slack-webhook-url>' });

log('error', 'This is an error message').slack();
log('warn', 'Oh no, this is a waning').slack();
```

### Tracing

Outputing a console trace:

```js
const log = require('logflake')();

log('trace', 'This message will output a trace');
```

### Dont log to STD

```js
const log = require('logflake')({ logDir: './logs' });

log('quiet', 'Anything will be outputed on std').save();
```

### ES6 Module Usage

```js
import logger from 'logflake'

const log = logger({ options });

log('Whatever...');
```

There are much more super powers, but those are the common ones. Read this documentation to know all of them.

# Getting Started

Import LogFlake, create a logger function and log whatever you want.

```js
const logger = require('logflake');
const log = logger();

log('Hello world!');
```

Or if you prefer ESM

```js
import logger from 'logflake';
const log = logger();

log('Hello world!');
```

When using CJS you can use a shorthand

```js
const log = require('logflake')();

log('Hello world!');
```

# Basic Usage

To log a message or anything, you simply do:

```js
log('Hello World');
```

This will output:

```log
[ CONSOLE LOG ] linux: username (main: test.js) 7/24/2021, 11:34:14 PM 

Hello world
········································································
```

You must have noticed the header with useful information. By default, they are:

```
[ CONSOLE LOG ] linux: username (main: test.js) 7/24/2021, 11:34:14 PM 
1*              2*     3*       4*              5*
``` 

1. This is the header prefix or namespace, setted as "CONSOLE" by default. It can be changed by you. The second term is the log level (`LOG` by default. The header prefixes are colorized in according to the log level: `{ log: 'blue', info: 'cyan', warn: 'yellow', error: 'red', trace: 'magenta', quiet: 'black' }`.

2. The current Operational System label information.

3. The current O.S. username information.

4. The current mainfile that is running the code.

5. The datetime notation (in `en` by default). You can change the locale on the options.

You can disable or enable the items `2, 3, 4, 5` on the `LogFlake` options. 

## The log() function

```
log(level?: string, ...arguments: any): Chain
```

We call it the `log` function because its just a convention, but you can name it whatever yout want. Check how to create a `log` function in the `Getting Started` section of this doc. As already said, the `log` function API has exactly the same usage of the common `console.log`. So, you can do anything you would do with a console.log, for example:

```js
const example = { fizz: 1, buzz: 2 };

log('Hello %s', 'world');
log('This is an object', example);
```

The first argument of the `log()` function can be used to control the Log Level that you want to use. When you dont specify the level, the common `log` level will be used by default.

## Log Levels

The console levels are:

| level | description | prefix color |
|---|---|---|
| log | simple log message | blue |
| info | equivalent to log | cyan |
| warn | shows a warn message | yellow |
| error | shows an error message | red |
| trace | shows a console trace | magenta |
| quiet | do not output to std | no color |

To output an error message, for example:

```js
log('error', 'This is an error message');
```

This will output:

```log
[ CONSOLE ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM 

This is an error message
········································································
```

The usage remains the same:

```js
const error = new Error('Unexpected error');

log('error', 'An unexpected error has occurred: ', error);
``` 

# Logger Options

There is a plenty of options you can set on your `logger`. You must pass the options as an object when calling the `LogFlake` function:

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

## Options

| Option | Description | Default |
| --- | --- | --- |
| prefix | Change the log header prefix (namespace) | 'console' | 
| colors | Turn on/off colors on the console output | true |
| header | Turn on/off the log header with further information | true |
| lines | When true, adds a separation line at the end of each log message | true |
| linesChar | The char to be used to build the log separation lines | '·' |
| headerTextColor | Defines the header information text color | gray |
| dateLocale | The header datetime stamp locale. Accepts any JS Locale String | 'en' |
| username | Shows the O.S. username on the log header | true |
| datetime | Shows a datetime stamp on the log header | true |
| platform | Shows the current platform on the log header | true |
| mainModule | Shows the main module on the log header | true |
| callCount | Shows on header how many times the same log() function has been called at the current runtime/process | false |
| disabled | When true, disables all the logs operations on the current instance | false |
| seamless | Dont beautify anything, no further info. Use the common console output | false |
| showLogHash | If true, shows a unique log hash on header of each log message | false |
| alwaysSave | Save all log function instance messages on a file (must set the logDir option) | false |
| alwaysQuiet | Dont output the log messages to the current console (std*) | false |
| logDir | Directory where the logs must saved. They are automatically named | '' |
| format | Any valid option of the node `util.formatWithOptions()` function | {} |
| linebreak | When true, adds a linebreak at the end of each log message | false |
| onLog | Event triggered everytime a log is fired with the current function (see `Events` on this doc) |
| slackDisabled | Will ignore the "slack" method, and wont send log results to slack | false |
| slackWebHookUrl | Slack web hook URL used to send log messages directly to slack | null |

> Obs 1. You can check all the `format` available options here: https://nodejs.org/api/util.html#util_util_inspect_object_options  

> Obs 2. Every `log()` log function position on the code is marked with a unique hash, so we can count how many times it was called, for example. 

> Obs 3. The `headerTextColor` option accepts any Chalk color. Check all the modifiers here: https://www.npmjs.com/package/chalk

> Obs 4. You can see how to get a Slack Webhook Url here: https://slack.com/intl/en-br/help/articles/115005265063-Incoming-webhooks-for-Slack

# Namespaces (Prefix)

For every `log` function instance you can have a `namespace`. This is simply a `prefix` showed on the console message header.
To change the console namespace (prefix) you can pass a string when creating the `log()` function, or pass it as an option.

## Using namespaces:

You can define a namespace directly when creating the `log()` function: 

```js
const logger = require('logflake');
const log = logger('Hello');              // HELLO will be the namespace

log('Hello world');                       // HELLO namespaced log
log('error', 'This is an error message'); // HELLO namespaced log
```

Will output:

```log
[ HELLO LOG ] linux: username (main: test.js) 7/24/2021, 11:45:57 PM 

Hello world
········································································
[ HELLO ERROR ] linux: username (main: test.js) 7/24/2021, 11:46:01 PM 

This is an error message
········································································
``` 

Note the "Hello" namespace on the log header. Every message logged with the namespaced `log()` function will be prefixed with `HELLO`.

## Defining the `namespace` as an option:

You can also pass the namespace by defining the `prefix` option:

```js
const logger = require('logflake');
const log = logger({ prefix: 'Hello' });  // "HELLO" will be the Namespace

log('Hello world');                       // HELLO namespaced log
log('error', 'This is an error message'); // HELLO namespaced log
```

## Namespace shorthand

If you wont use any other option, and you are using CJS, you can use a shorthand and pass the namespace directly like this:

```js
const log = require('logflake')('Namespace');
```

# Advanced usage

The `log()` function has a chained toolset that allows you to control and change your log behavior. To run a log only once inside a loop and save its output on a file, for example, you could do:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs' });

for(let i=0; i<100; i++) {
  log('error', 'Oh no, an error has occurred!')
    .once()
    .save();
}
```

The log above will be fired only once, even inside a loop, and its output will be saved on a file at `logDir` path. The `log()` chain provides chained methods to help you with things like that. We will talk about chained methods in a next sections.

## Chaining

Any `log` call has a chain of useful methods. The example below runs only once and saves its output on a local file. See the section `Chained methods` of this doc to know more about.

```js
log('This is an example')
  .once()
  .save();
```

## Referencing

You can create a "reference" to a log function by assigning it to a variable or const:

```js
// the log will be fired and assigned to a const
const logError = log('Unexpected error');

// the log will be saved
logError.save();
```

In the example bellow, the log will be triggered, assigned to the const, then saved. But you can have a situation when you dont want to immediately trigger the log while assigning it to a variable, then you can use quiet as log level. In the example, the `fire()` method will trigger the referenced log:

```js
const logError = log('quiet', 'Unexpected error');

logError.fire('error').save();
``` 

# Chained Methods

As said, you can use chained methods to change your log behavior. The methods are:

## save

```
save(options?: SaveOptions): chain  
```

Saves the log output to a local file. This method depends on the option `logDir`. The `logDir` option will specify where to save the log files. When calling "save()" a file named with the current date will be created on the `logDir`. All the logs saved on the current day and pointing to the same folder will be saved in the same file, and so on.  

Usage:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs/' });

// this log message wont be saved
log('Not saved');

// this log message will be saved
log('Will be saved').save();
``` 

When the option `alwaysSave` is true, all the logs will be saved. The save method will be implicitly called for all of them. In this case, your explicity `save()` callings will be ignored to avoid duplication. If you set `{ force: true }` as save() option, it will be fired twice: one due the `alwaysSave` option, another due the explicit save({ force: true }).  

For example:

```js
const logger = require('logflake');
const log = logger({ logDir: './logs/', alwaysSave: true });

// this log message will be saved 1 time
log('Will be saved A');

// this log message will be saved 1 time
log('Will be saved B').save();

// this log will be saved 2 times, one
// due the alwaysSave, other due forced save
log('Will be saved C').save({ force: true});
```

The only available option on `save` is `{ force }`.

## once

```
once(): chain  
```

Tells the log to be fired for one single time on the current runtime. If you are inside a big for loop, a route or whatever, and for some reason a deduplicated log is useful for you, or if you just dont want thounsands of duplicated outputs, you can use once:

```js
for(let i = 0; i < 1000; i++) {
  // this log will be fired only once
  log('Just one time').once();
}
``` 

The log chain will also occur only once:

```js
for(let i = 0; i < 1000; i++) {
  // this log will be fired and saved only once
  log('Just one time').once().save();
}
```

## get

```
get(callback: Function, colors: boolean = false): chain
```

Gets the current log output and a bunch of useful information. This is handy when you want to send an specific log output/information to other destinations as a database, slack, telegram, etc.  

```js
log('error', 'Example').get((output, info) => {
  // do whatever you want with the params
});
```

This function accepts a callback that returns the log `output` and an `info` object. Also accepts a second boolean parameter which gets the `output` with colors; default is `false`. Note: if this very same function has been called 1000 times, the hash will be the same since is a hash per function/line. 

#### Callback

```
cb(output: string, info: object): unknown
```

| param | description |
|---|---|
| output | the log output as string, with the header, exactly as showed on the console (std) |
| info | an object containing useful information about the triggered log |

#### Output

For the given example, the `output` would be the following string:

``` 
[ CONSOLE ERROR ] linux: username (main: test.js) 7/26/2021, 9:42:49 PM 

Example
········································································
```

#### Info

The `info` object returns the following properties:

```log
{
  hash       | the triggered function hash
  trace      | a stack trace of the triggered log
  level      | the log level that has been called
  date       | the current date of the log call
  dateUTC    | the current UTC date of the log call
  callCount  | number of times that this same log was triggered
}
```

## fire

```
fire(level?: string, args?: any): chain
```

When using references, you can use `fire` to trigger the referenced log. When using `fire`, you also gets a new log function. The `level` parameter on this function overrides the original log level, and the `args` increments the original parameters. If you dont specify a level for `fire()`, "log" will be used by default. For example:

```js
const logError = log('quiet', 'Unexpected error');

if (someErrorCheck) {
  logError.fire('error'); // log "Unexpected error" x1
}

if (anotherErrorCheck) {
  logError.fire('error'); // log "Unexpected error" x1
}
```

You can also use different log levels for same reference:

```js
const logGeneric = log('quiet', 'Generic message');

if (whateverYouWant) {
  logGeneric.fire();        // log LOG "Generic message" x1
}

if (someErrorCheck) {
  logGeneric.fire('error'); // log ERROR "Generic message" x1
}

if (anotherErrorCheck) {
  logGeneric.fire('warn');  // log WARN "Generic message" x1
}
```

You can also increment te original parameters:

```js
const reportFileError = log('quiet', 'There was an error on the file %s');

// output: There was an error on the file index.js
reportFileError.fire('error', 'index.js');
```

```js
const logProcessedObject = log('quiet', 'Object processed: ');

// output: Object processed: { fizz: 1, buzz: 2 }
logProcessedObject.fire('info', { fizz: 1, buzz: 2});

// output: Object processed: { fizz: 1, buzz: 2 } { fizzbuzz: 3 }
logProcessedObject.fire('info', { fizz: 1, buzz: 2}, { fizzbuzz: 3 });
```

## slack

```
slack(options?: object, callback?: function): chain
```

This methods sends the current message being log directly to slack. To do it, you must first set the option "slackWebHookUrl" on you LogFlake instance. You can see how to get your Slack Webhook URL here: https://slack.com/intl/en-br/help/articles/115005265063-Incoming-webhooks-for-Slack.

After that, you can send logs directly to slack like this:

```js
const log = require('logflake')({
  slackDisabled: false,
  slackWebHookUrl: 'https://hooks.slack.com/services/yourwebhooktoken',
});

log('Hello World!').slack();
```

The log above will be sent to slack. The channel and other details are configured while getting your webhook url. The "slackDisabled" option is false by default, you can ommit it, or turn true if you want to disabled slack messages in a given environment. The slack functions has 2 params: 1. options: which accepts any slack webhook option, and 2. a callback that will run as soon the message has been delivered.

```js
const log = require('logflake')({
  slackDisabled: false,
  slackWebHookUrl: 'https://hooks.slack.com/services/yourwebhooktoken',
});

log('Hello World!').slack({ icon_emoji: ':bell:' }, status => {
  const messageDelivered = status.text === 'ok';

  //...
});
```

# Events

The `onLog` event is available as a Logger Option and accepts a callback that is triggered everytime a log output occurs. The params passed to the callback are `output` and `info` containing useful information about the triggered log. It works very similar to the `get` method, but its automatically triggered for all log outputs.  

```js
const logger = require('logflake');

const log = logger({
  onLog: (output, info) => {
    // do whatever you want with the params
  }
});

log('Hello world');
log('error', 'Oh no, an error!');
```

On the example above, the `onLog` function callback will be triggered 2 times, passing the `output` containing the log contents, and the `info` with information about the log call. To see details about the `output` and 'info' params, check the `get()` method on the `Chained methods` section. Everytime a log is generated with this instance (function), the `onLog` callback will be triggered. Your callback will have this signature:

```
cb(output: string, info: object): unknown
```

This is very very handy if you want to create plugins or new transporters for `LogFlake`. You can use it to capture the logs and send to a database, slack, telegram or whatever you want.

# About

LogFlake is a `Free and Open Source` package created by Felippe Regazio.
