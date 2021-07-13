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
  logDir: string;
}

type LogLevels = {
  [key: string]: string;
}

type Chain = {
  save: Function;
  once: Function;
}

type FnTrack = {
  hash?: string;
  once?: boolean;
  callCount?: number;
  fnDisabled?: boolean;
}