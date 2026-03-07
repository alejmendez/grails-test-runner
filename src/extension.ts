import * as vscode from 'vscode';
import { GrailsTestCodeLensProvider } from './codeLensProvider';
import { runGradleTest } from './testRunner';

export function activate(context: vscode.ExtensionContext): void {
    console.log('Grails Test Runner activado');

    const codeLensProvider = new GrailsTestCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        { language: 'groovy', pattern: '**/*{Spec,Tests,Test}.groovy' },
        codeLensProvider
    );
    context.subscriptions.push(codeLensDisposable);

    const runTestCommand = vscode.commands.registerCommand(
        'grails-test-runner.runTest',
        (className: string, testName: string, testType: string) => {
            runGradleTest(className, testName, testType);
        }
    );
    context.subscriptions.push(runTestCommand);

    const runTestClassCommand = vscode.commands.registerCommand(
        'grails-test-runner.runTestClass',
        (className: string, testType: string) => {
            runGradleTest(className, null, testType);
        }
    );
    context.subscriptions.push(runTestClassCommand);

    const rerunTestCommand = vscode.commands.registerCommand(
        'grails-test-runner.rerunTest',
        (className: string, testName: string, testType: string) => {
            runGradleTest(className, testName, testType, true);
        }
    );
    context.subscriptions.push(rerunTestCommand);

    const rerunTestClassCommand = vscode.commands.registerCommand(
        'grails-test-runner.rerunTestClass',
        (className: string, testType: string) => {
            runGradleTest(className, null, testType, true);
        }
    );
    context.subscriptions.push(rerunTestClassCommand);
}

export function deactivate(): void {
    console.log('Grails Test Runner desactivado');
}
