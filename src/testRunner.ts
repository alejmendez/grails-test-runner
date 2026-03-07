import * as vscode from 'vscode';

export function runGradleTest(className: string, testName: string | null, testType: string, rerunTasks = false): void {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No hay workspace abierto');
        return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;

    let testFilter: string;
    if (testName) {
        const escapedTestName = testName.replace(/['"]/g, '');
        testFilter = `"${className}.${escapedTestName}*"`;
    } else {
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
