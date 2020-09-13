import { Either, isErr } from "./functional/either";
import { app, dialog } from "electron";

const githubIssues: string = "https://github.com/avarsh/square-robin/issues"

export function alertOnFail<T>(either: Either<string, T>): T {
  if (either.kind === "error") {
    // Create a popup
    const errStr = `Error has occured: ${either.err}. This shouldn't be happening - consider reporting this issue at ${githubIssues}`;
    dialog.showErrorBox("Uh-oh, something broke", errStr);
    app.exit(1);
  } else {
    return either.val;
  }
}