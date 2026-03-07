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
exports.GrailsTestCodeLensProvider = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
class GrailsTestCodeLensProvider {
    provideCodeLenses(document) {
        const codeLenses = [];
        const text = document.getText();
        const filePath = document.uri.fsPath;
        if (!filePath.match(/(?:Spec|Tests?)\.groovy$/)) {
            return codeLenses;
        }
        const classMatch = constants_1.CLASS_REGEX.exec(text);
        if (classMatch) {
            const className = classMatch[1];
            const packageName = this.extractPackage(text);
            const fullClassName = packageName ? `${packageName}.${className}` : className;
            const testType = this.getTestType(filePath);
            const classLine = document.positionAt(classMatch.index).line;
            const range = new vscode.Range(classLine, 0, classLine, 0);
            codeLenses.push(new vscode.CodeLens(range, {
                title: '▶ Run All Tests',
                command: 'grails-test-runner.runTestClass',
                arguments: [fullClassName, testType]
            }), new vscode.CodeLens(range, {
                title: '↺ Rerun All Tests',
                command: 'grails-test-runner.rerunTestClass',
                arguments: [fullClassName, testType]
            }));
        }
        const methodRegex = /void\s+['"](.+?)['"]\s*\(\s*\)/g;
        let methodMatch;
        while ((methodMatch = methodRegex.exec(text)) !== null) {
            const testName = methodMatch[1];
            const classMatch2 = constants_1.CLASS_REGEX.exec(text);
            if (classMatch2) {
                const className = classMatch2[1];
                const packageName = this.extractPackage(text);
                const fullClassName = packageName ? `${packageName}.${className}` : className;
                const testType = this.getTestType(filePath);
                const methodLine = document.positionAt(methodMatch.index).line;
                const range = new vscode.Range(methodLine, 0, methodLine, 0);
                codeLenses.push(new vscode.CodeLens(range, {
                    title: '▶ Run Test',
                    command: 'grails-test-runner.runTest',
                    arguments: [fullClassName, testName, testType]
                }), new vscode.CodeLens(range, {
                    title: '↺ Rerun Test',
                    command: 'grails-test-runner.rerunTest',
                    arguments: [fullClassName, testName, testType]
                }));
            }
        }
        return codeLenses;
    }
    extractPackage(text) {
        const packageMatch = /^package\s+([\w.]+)/m.exec(text);
        return packageMatch ? packageMatch[1] : null;
    }
    getTestType(filePath) {
        if (filePath.includes('integration-test')) {
            return 'integrationTest';
        }
        return 'test';
    }
}
exports.GrailsTestCodeLensProvider = GrailsTestCodeLensProvider;
//# sourceMappingURL=codeLensProvider.js.map