import * as assert from 'assert';
import { CLASS_REGEX, METHOD_REGEX } from '../../constants';

describe('CLASS_REGEX', () => {
    function freshRegex() {
        return new RegExp(CLASS_REGEX.source, CLASS_REGEX.flags);
    }

    it('detecta clase Spec', () => {
        const match = freshRegex().exec('class FooSpec extends Specification {');
        assert.ok(match);
        assert.strictEqual(match[1], 'FooSpec');
    });

    it('detecta clase Tests', () => {
        const match = freshRegex().exec('class FooTests extends GroovyTestCase {');
        assert.ok(match);
        assert.strictEqual(match[1], 'FooTests');
    });

    it('detecta clase Test', () => {
        const match = freshRegex().exec('class FooTest extends Specification {');
        assert.ok(match);
        assert.strictEqual(match[1], 'FooTest');
    });

    it('no detecta clase sin sufijo Spec/Test/Tests', () => {
        const match = freshRegex().exec('class MyService {');
        assert.strictEqual(match, null);
    });

    it('detecta cuando hay paquete antes de la clase', () => {
        const text = 'package com.example\n\nclass FooSpec extends Specification {';
        const match = freshRegex().exec(text);
        assert.ok(match);
        assert.strictEqual(match[1], 'FooSpec');
    });
});

describe('METHOD_REGEX', () => {
    function freshRegex() {
        return new RegExp(METHOD_REGEX.source, METHOD_REGEX.flags);
    }

    it('detecta método con comillas dobles', () => {
        const match = freshRegex().exec('void "debería crear usuario"()');
        assert.ok(match);
        assert.strictEqual(match[1], 'debería crear usuario');
    });

    it('detecta método con comillas simples', () => {
        const match = freshRegex().exec("void 'debería eliminar usuario'()");
        assert.ok(match);
        assert.strictEqual(match[1], 'debería eliminar usuario');
    });

    it('detecta múltiples métodos en un texto', () => {
        const text = `
            void "primer test"() {}
            void "segundo test"() {}
        `;
        const regex = freshRegex();
        const matches: string[] = [];
        let m;
        while ((m = regex.exec(text)) !== null) {
            matches.push(m[1]);
        }
        assert.deepStrictEqual(matches, ['primer test', 'segundo test']);
    });

    it('no detecta métodos sin void', () => {
        const match = freshRegex().exec('String "no es un test"()');
        assert.strictEqual(match, null);
    });

    it('no detecta métodos con parámetros', () => {
        const match = freshRegex().exec('void "con param"(String arg)');
        assert.strictEqual(match, null);
    });
});
