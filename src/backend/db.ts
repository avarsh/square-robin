// A module to store data

import * as path from "path";
import fs = require('fs');
import { app } from "electron";

import { Task } from "../types/task";
import { Either } from "../utils/functional/either";
import { guard } from "../utils/functional/guard";

const configDir = app.getPath("userData");
const dbFile = path.join(configDir, "robindb.json");

interface Database {
  tasks: Array<Task>;
}

/**
 * Check whether the database exists.
 */
export function dbExists(): boolean {
  return fs.existsSync(dbFile);
}

/**
 * Setup an initial database.
 */
export function setupDB(): Database {
  const initialData: Database = {
    tasks: []
  };
  fs.writeFile(dbFile, JSON.stringify(initialData), () => { console.log("Created initial database"); });
  return initialData;
}

/**
 * Write database to the file.
 * @param db The database to write out
 */
export function writeDatabase(db: Database): Either<string, void> {
  const errStr: string = `Cannot find database at location ${dbFile}`;
  return guard<void>(dbExists(), errStr).then(() =>
    fs.writeFileSync(dbFile, JSON.stringify(db))
  );
}

/**
 * Construct a database object from file.
 */
export function readDatabase(): Either<string, Database> {
  const errStr: string = `Cannot find database at location ${dbFile}`;
  console.log(dbFile);
  return guard<Database>(dbExists(), errStr).then(() => 
    JSON.parse(fs.readFileSync(dbFile, "utf-8")) 
  );
}

export { Database };