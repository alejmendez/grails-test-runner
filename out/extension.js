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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const codeLensProvider_1 = require("./codeLensProvider");
const testRunner_1 = require("./testRunner");
function activate(context) {
    console.log('Grails Test Runner activado');
    const codeLensProvider = new codeLensProvider_1.GrailsTestCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider({ language: 'groovy', pattern: '**/*{Spec,Tests,Test}.groovy' }, codeLensProvider);
    context.subscriptions.push(codeLensDisposable);
    const runTestCommand = vscode.commands.registerCommand('grails-test-runner.runTest', (className, testName, testType) => {
        (0, testRunner_1.runGradleTest)(className, testName, testType);
    });
    context.subscriptions.push(runTestCommand);
    const runTestClassCommand = vscode.commands.registerCommand('grails-test-runner.runTestClass', (className, testType) => {
        (0, testRunner_1.runGradleTest)(className, null, testType);
    });
    context.subscriptions.push(runTestClassCommand);
    const rerunTestCommand = vscode.commands.registerCommand('grails-test-runner.rerunTest', (className, testName, testType) => {
        (0, testRunner_1.runGradleTest)(className, testName, testType, true);
    });
    context.subscriptions.push(rerunTestCommand);
    const rerunTestClassCommand = vscode.commands.registerCommand('grails-test-runner.rerunTestClass', (className, testType) => {
        (0, testRunner_1.runGradleTest)(className, null, testType, true);
    });
    context.subscriptions.push(rerunTestClassCommand);
}
function deactivate() {
    console.log('Grails Test Runner desactivado');
}
//# sourceMappingURL=extension.js.map