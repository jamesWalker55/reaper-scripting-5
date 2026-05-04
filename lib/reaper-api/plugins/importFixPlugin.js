import { SourceNode } from "source-map";
import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

const PREPEND_FUNCTION_NAME = "AddCwdToImportPaths";
const PATHS_STORE_KEY = "_importFixSourceFiles";

const IMPORT_FIX_CODE = String.raw`-- Fix import paths
local __script_directory = ({reaper.get_action_context()})[2]:match('^(.+[\\\\//])') .. "?.lua"
package.path = __script_directory .. ";" .. package.path

`;

class CustomPrinter extends tstl.LuaPrinter {
  /**
   * Override printFile
   * @param {tstl.File} file
   * @returns {SourceNode}
   */
  printFile(file) {
    const originalResult = super.printFile(file);

    /** @type {Set<string> | undefined} */
    const pathsStore = this[PATHS_STORE_KEY];

    if (pathsStore === undefined) return originalResult;
    if (!pathsStore.has(this.relativeSourcePath)) return originalResult;
    pathsStore.delete(this.relativeSourcePath);

    return this.createSourceNode(file, [IMPORT_FIX_CODE, originalResult]);
  }

  /**
   * @param {tstl.CallExpression} expression
   * @returns {SourceNode}
   */
  printCallExpression(expression) {
    if (expression.expression.text !== PREPEND_FUNCTION_NAME) {
      return super.printCallExpression(expression);
    }

    if (expression.params.length !== 0) {
      throw new Error(
        `${PREPEND_FUNCTION_NAME}() must be called with no parameters`,
      );
    }

    if (this[PATHS_STORE_KEY] === undefined) {
      this[PATHS_STORE_KEY] = new Set();
    }

    /**
     * Source files that should have the import fix applied
     * @type {Set<string>}
     */
    const pathsStore = this[PATHS_STORE_KEY];
    pathsStore.add(this.relativeSourcePath);

    return this.createSourceNode(expression, []);
  }
}

/** @type {tstl.Plugin} */
const plugin = {
  /**
   * @param {ts.Program} program
   * @param {tstl.EmitHost} emitHost
   * @param {string} fileName
   * @param {tstl.File} file
   * @returns
   */
  printer: (program, emitHost, fileName, file) =>
    new CustomPrinter(emitHost, program, fileName).print(file),
};

export default plugin;
