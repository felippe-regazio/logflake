type Options = {
  prefix?: string;
  lines?: boolean;
  lineChar?: string;
  dateLocale?: string;
  username?: boolean;
  date?: boolean;
  platform?: boolean;
  mainModule?: boolean;
  disabled?: boolean;
  seamless?: boolean;
  showLogHash?: boolean;
  alwaysSave: boolean;
  alwaysQuiet: boolean;
  logDir: string;
  linebreak: boolean;
}

type LogLevels = {
  [key: string]: string;
}

type Chain = {
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