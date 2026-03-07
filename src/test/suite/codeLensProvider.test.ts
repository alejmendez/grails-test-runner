import * as assert from 'assert';
import { GrailsTestCodeLensProvider } from '../../codeLensProvider';
import { CodeLens } from '../mocks/vscode';

/**
 * Crea un TextDocument simulado a partir de texto y ruta de archivo.
 */
function makeDocument(text: string, fsPath: string) {
    return {
        getText: () => text,
        uri: { fsPath },
        positionAt: (offset: number) => {
            const line = text.slice(0, offset).split('\n').length - 1;
            return { line };
        }
    };
}

describe('GrailsTestCodeLensProvider', () => {
    const provider = new GrailsTestCodeLensProvider();

    describe('provideCodeLenses — archivos ignorados', () => {
        it('retorna vacío para archivos no-Spec/Test/Tests', () => {
            const doc = makeDocument('class MyService {}', '/src/main/groovy/MyService.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses.length, 0);
        });

        it('retorna vacío para archivos .groovy sin sufijo correcto', () => {
            const doc = makeDocument('class Helper {}', '/src/test/groovy/Helper.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses.length, 0);
        });
    });

    describe('provideCodeLenses — clase sin métodos', () => {
        const text = `package com.example\n\nclass UserSpec extends Specification {\n}`;
        const doc = makeDocument(text, '/src/test/groovy/com/example/UserSpec.groovy');

        it('genera 2 CodeLens (Run All + Rerun All)', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses.length, 2);
        });

        it('primer CodeLens es Run All Tests', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses[0].command?.title, '▶ Run All Tests');
            assert.strictEqual(lenses[0].command?.command, 'grails-test-runner.runTestClass');
        });

        it('segundo CodeLens es Rerun All Tests', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses[1].command?.title, '↺ Rerun All Tests');
            assert.strictEqual(lenses[1].command?.command, 'grails-test-runner.rerunTestClass');
        });

        it('fullClassName incluye el paquete', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.deepStrictEqual(lenses[0].command?.arguments, ['com.example.UserSpec', 'test']);
        });
    });

    describe('provideCodeLenses — clase con métodos', () => {
        const text = [
            'package com.example',
            '',
            'class OrderSpec extends Specification {',
            '    void "debería crear orden"() {}',
            '    void "debería cancelar orden"() {}',
            '}'
        ].join('\n');
        const doc = makeDocument(text, '/src/test/groovy/com/example/OrderSpec.groovy');

        it('genera 2 CodeLens de clase + 2 por cada método (6 total)', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses.length, 6);
        });

        it('CodeLens de métodos tienen comando runTest/rerunTest', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            const methodLenses = lenses.slice(2);
            assert.strictEqual(methodLenses[0].command?.command, 'grails-test-runner.runTest');
            assert.strictEqual(methodLenses[1].command?.command, 'grails-test-runner.rerunTest');
            assert.strictEqual(methodLenses[2].command?.command, 'grails-test-runner.runTest');
            assert.strictEqual(methodLenses[3].command?.command, 'grails-test-runner.rerunTest');
        });

        it('argumentos de runTest incluyen className, testName y testType', () => {
            const lenses = provider.provideCodeLenses(doc as any);
            assert.deepStrictEqual(lenses[2].command?.arguments, [
                'com.example.OrderSpec',
                'debería crear orden',
                'test'
            ]);
        });
    });

    describe('provideCodeLenses — tipo de test', () => {
        it('detecta test unitario desde ruta src/test/', () => {
            const text = 'package x\nclass FooSpec extends Specification {}';
            const doc = makeDocument(text, '/project/src/test/groovy/x/FooSpec.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses[0].command?.arguments?.[1], 'test');
        });

        it('detecta integrationTest desde ruta integration-test', () => {
            const text = 'package x\nclass FooSpec extends Specification {}';
            const doc = makeDocument(text, '/project/src/integration-test/groovy/x/FooSpec.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses[0].command?.arguments?.[1], 'integrationTest');
        });
    });

    describe('provideCodeLenses — sin paquete', () => {
        it('fullClassName es solo el nombre de clase cuando no hay package', () => {
            const text = 'class StandaloneSpec extends Specification {}';
            const doc = makeDocument(text, '/src/test/groovy/StandaloneSpec.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.strictEqual(lenses[0].command?.arguments?.[0], 'StandaloneSpec');
        });
    });

    describe('provideCodeLenses — sufijos alternativos', () => {
        it('reconoce archivos *Tests.groovy', () => {
            const text = 'class FooTests extends GroovyTestCase {}';
            const doc = makeDocument(text, '/src/test/groovy/FooTests.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.ok(lenses.length > 0);
        });

        it('reconoce archivos *Test.groovy', () => {
            const text = 'class FooTest extends GroovyTestCase {}';
            const doc = makeDocument(text, '/src/test/groovy/FooTest.groovy');
            const lenses = provider.provideCodeLenses(doc as any);
            assert.ok(lenses.length > 0);
        });
    });
});
