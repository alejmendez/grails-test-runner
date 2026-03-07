import * as assert from 'assert';
import * as vscode from 'vscode';
import { runGradleTest } from '../../testRunner';

/**
 * Captura el último comando enviado a la terminal "Grails Tests".
 */
function setupTerminalSpy(): { lastCommand: string | null; lastCwd: string | null } {
    const spy = { lastCommand: null as string | null, lastCwd: null as string | null };

    (vscode.workspace as any).workspaceFolders = [
        { uri: { fsPath: '/workspace/myproject' } }
    ];

    (vscode.window as any).terminals = [];
    (vscode.window as any).createTerminal = (opts: { name: string; cwd?: string }) => {
        spy.lastCwd = opts.cwd ?? null;
        return {
            name: opts.name,
            show: () => {},
            sendText: (text: string) => { spy.lastCommand = text; }
        };
    };

    return spy;
}

describe('runGradleTest', () => {
    afterEach(() => {
        (vscode.workspace as any).workspaceFolders = undefined;
        (vscode.window as any).terminals = [];
    });

    describe('sin workspace', () => {
        it('no lanza excepción cuando no hay workspace', () => {
            (vscode.workspace as any).workspaceFolders = undefined;
            const errors: string[] = [];
            (vscode.window as any).showErrorMessage = (msg: string) => errors.push(msg);
            assert.doesNotThrow(() => runGradleTest('com.example.FooSpec', null, 'test'));
            assert.ok(errors.length > 0);
        });
    });

    describe('construcción del comando', () => {
        it('ejecuta test de clase completa', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', null, 'test');
            assert.strictEqual(spy.lastCommand, './gradlew test --tests "com.example.FooSpec"');
        });

        it('ejecuta test individual con wildcard al final', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', 'debería crear usuario', 'test');
            assert.strictEqual(
                spy.lastCommand,
                './gradlew test --tests "com.example.FooSpec.debería crear usuario*"'
            );
        });

        it('usa integrationTest para tests de integración', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', null, 'integrationTest');
            assert.strictEqual(spy.lastCommand, './gradlew integrationTest --tests "com.example.FooSpec"');
        });

        it('agrega --rerun-tasks cuando rerunTasks=true', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', null, 'test', true);
            assert.strictEqual(
                spy.lastCommand,
                './gradlew test --tests "com.example.FooSpec" --rerun-tasks'
            );
        });

        it('agrega --rerun-tasks en test individual', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', 'mi test', 'test', true);
            assert.strictEqual(
                spy.lastCommand,
                './gradlew test --tests "com.example.FooSpec.mi test*" --rerun-tasks'
            );
        });

        it('elimina comillas del nombre del test', () => {
            const spy = setupTerminalSpy();
            runGradleTest('com.example.FooSpec', `test con "comillas"`, 'test');
            assert.ok(!spy.lastCommand?.includes('"comillas"'));
        });

        it('usa el cwd del workspace en la terminal', () => {
            const spy = setupTerminalSpy();
            runGradleTest('FooSpec', null, 'test');
            assert.strictEqual(spy.lastCwd, '/workspace/myproject');
        });
    });

    describe('reutilización de terminal', () => {
        it('reutiliza la terminal existente "Grails Tests"', () => {
            (vscode.workspace as any).workspaceFolders = [
                { uri: { fsPath: '/workspace/myproject' } }
            ];

            let createCount = 0;
            let lastSentCommand = '';

            const existingTerminal = {
                name: 'Grails Tests',
                show: () => {},
                sendText: (text: string) => { lastSentCommand = text; }
            };

            (vscode.window as any).terminals = [existingTerminal];
            (vscode.window as any).createTerminal = () => {
                createCount++;
                return existingTerminal;
            };

            runGradleTest('FooSpec', null, 'test');

            assert.strictEqual(createCount, 0, 'no debería crear una nueva terminal');
            assert.ok(lastSentCommand.includes('FooSpec'));
        });
    });
});
