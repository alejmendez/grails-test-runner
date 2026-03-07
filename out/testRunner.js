"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGradleTest = runGradleTest;
const vscode = __importStar(require("vscode"));
function runGradleTest(className, testName, testType, rerunTasks = false) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No hay workspace abierto');
        return;
    }
    const workspacePath = workspaceFolders[0].uri.fsPath;
    let testFilter;
    if (testName) {
        const escapedTestName = testName.replace(/['"]/g, '');
        testFilter = `"${className}.${escapedTestName}*"`;
    }
    else {
        testFilter = `"${className}"`;
    }
    const rerunFlag = rerunTasks ? ' --rerun-tasks' : '';
    const command = `./gradlew ${testType} --tests ${testFilter}${rerunFlag}`;
    let terminal = vscode.window.terminals.find(t => t.name === 'Grails Tests');
    if (!terminal) {
        terminal = vscode.window.createTerminal({
            name: 'Grails Tests',
            cwd: workspacePath
        });
    }
    terminal.show();
    terminal.sendText(command);
}
//# sourceMappingURL=testRunner.js.map