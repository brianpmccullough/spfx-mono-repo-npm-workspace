declare interface IMonorepoCommandSetCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'MonorepoCommandSetCommandSetStrings' {
  const strings: IMonorepoCommandSetCommandSetStrings;
  export = strings;
}
