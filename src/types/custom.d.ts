declare module NodeJS {
  interface Global {
      _appRoot: string;
      _dbFile: string;
  }
}