type Options = {
  prefix?: string;
  colors?: boolean,
  lines?: boolean;
  header?: boolean;
  linesChar?: string;
  dateLocale?: string;
  username?: boolean;
  datetime?: boolean;
  platform?: boolean;
  mainModule?: boolean;
  disabled?: boolean;
  seamless?: boolean;
  showLogHash?: boolean;
  alwaysSave?: boolean;
  alwaysQuiet?: boolean;
  logDir?: string;
  format?: object;
  callCount?: boolean,
  linebreak?: boolean;
  onLog?: Function;
}

type LogLevels = {
  [key: string]: string;
}

type Chain = {
  get: Function;
  save: Function;
  once: Function;
  reset: Function
  fire: Function,
  disabled: Function,
}

type FnTrack = {
  hash?: string;
  callCount?: number;
  fnDisabled?: boolean;
}

type SaveOptions = {
  force?: boolean;
}

type LogInfo = {
  hash?: string;
  trace?: string;
  level?: string;
  date?: Date;
}