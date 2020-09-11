// A module to store data

import { app } from "electron";
import * as path from "path";
import fs = require('fs');

import { Task } from "../task";
import { Either } from "../../lang/either";
import { guard } from "../../lang/guard";

const configDir = app.getPath("userData");
const dbFile = path.join(configDir, "database.json");

type User = {
  name: string
}

interface Database {
  user: User;
  tasks: Array<Task>;
}

export function dbExists(): boolean {
  return fs.existsSync(dbFile);
}

export function setupDB(name: string): void {
  const initialData: Database = {
    user: {
      name: name
    },
    tasks: []
  };
  fs.writeFile(dbFile, JSON.stringify(initialData), () => { console.log("Created initial database"); });
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
  return guard<Database>(dbExists(), errStr).then(() => 
    JSON.parse(fs.readFileSync(dbFile, "utf-8")) 
  );
}