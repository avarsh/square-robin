// A module to store data

import * as path from "path";
import fs = require('fs');

import { Task } from "../utils/task";
import { Either } from "../utils/functional/either";
import { guard } from "../utils/functional/guard";

type User = {
  name: string
}

interface Database {
  user: User;
  tasks: Array<Task>;
}

export function dbExists(): boolean {
  return fs.existsSync(global._dbFile);
}

export function setupDB(name: string): void {
  const initialData: Database = {
    user: {
      name: name
    },
    tasks: []
  };
  fs.writeFile(global._dbFile, JSON.stringify(initialData), () => { console.log("Created initial database"); });
}

/**
 * Write database to the file.
 * @param db The database to write out
 */
export function writeDatabase(db: Database): Either<string, void> {
  const errStr: string = `Cannot find database at location ${global._dbFile}`;
  return guard<void>(dbExists(), errStr).then(() =>
    fs.writeFileSync(global._dbFile, JSON.stringify(db))
  );
}

/**
 * Construct a database object from file.
 */
export function readDatabase(): Either<string, Database> {
  const errStr: string = `Cannot find database at location ${global._dbFile}`;
  return guard<Database>(dbExists(), errStr).then(() => 
    JSON.parse(fs.readFileSync(global._dbFile, "utf-8")) 
  );
}