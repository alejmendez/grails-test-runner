import * as vscode from 'vscode';
import { CLASS_REGEX } from './constants';

export class GrailsTestCodeLensProvider implements vscode.CodeLensProvider {

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const filePath = document.uri.fsPath;

        if (!filePath.match(/(?:Spec|Tests?)\.groovy$/)) {
            return codeLenses;
        }

        const classMatch = CLASS_REGEX.exec(text);
        if (classMatch) {
            const className = classMatch[1];
            const packageName = this.extractPackage(text);
            const fullClassName = packageName ? `${packageName}.${className}` : className;
            const testType = this.getTestType(filePath);

            const classLine = document.positionAt(classMatch.index).line;
            const range = new vscode.Range(classLine, 0, classLine, 0);

            codeLenses.push(
                new vscode.CodeLens(range, {
                    title: '▶ Run All Tests',
                    command: 'grails-test-runner.runTestClass',
                    arguments: [fullClassName, testType]
                }),
                new vscode.CodeLens(range, {
                    title: '↺ Rerun All Tests',
                    command: 'grails-test-runner.rerunTestClass',
                    arguments: [fullClassName, testType]
                })
            );
        }

        const methodRegex = /void\s+['"](.+?)['"]\s*\(\s*\)/g;
        let methodMatch;

        while ((methodMatch = methodRegex.exec(text)) !== null) {
            const testName = methodMatch[1];
            const classMatch2 = CLASS_REGEX.exec(text);

            if (classMatch2) {
                const className = classMatch2[1];
                const packageName = this.extractPackage(text);
                const fullClassName = packageName ? `${packageName}.${className}` : className;
                const testType = this.getTestType(filePath);

                const methodLine = document.positionAt(methodMatch.index).line;
                const range = new vscode.Range(methodLine, 0, methodLine, 0);

                codeLenses.push(
                    new vscode.CodeLens(range, {
                        title: '▶ Run Test',
                        command: 'grails-test-runner.runTest',
                        arguments: [fullClassName, testName, testType]
                    }),
                    new vscode.CodeLens(range, {
                        title: '↺ Rerun Test',
                        command: 'grails-test-runner.rerunTest',
                        arguments: [fullClassName, testName, testType]
                    })
                );
            }
        }

        return codeLenses;
    }

    private extractPackage(text: string): string | null {
        const packageMatch = /^package\s+([\w.]+)/m.exec(text);
        return packageMatch ? packageMatch[1] : null;
    }

    private getTestType(filePath: string): string {
        if (filePath.includes('integration-test')) {
            return 'integrationTest';
        }
        return 'test';
    }
}
