# Grails Test Runner

Extensión para ejecutar tests de Grails/Spock directamente desde el editor con CodeLens.

## Instalación

Ejecuta el script de instalación desde la raíz del proyecto:

```bash
.vscode/extensions/grails-test-runner/install.sh
```

Luego reinicia Cursor/VS Code.

## Uso

1. Abre cualquier archivo `*Spec.groovy`
2. Verás botones sobre el código:
   - **▶ Run All Tests** - Sobre la clase, ejecuta todos los tests del archivo
   - **▶ Run Test** - Sobre cada método, ejecuta solo ese test

3. Al hacer clic, se abre una terminal y ejecuta el comando Gradle correspondiente

## Tipos de test soportados

| Ubicación | Comando Gradle |
|-----------|----------------|
| `src/test/groovy/` | `./gradlew test --tests "..."` |
| `src/integration-test/groovy/` | `./gradlew integrationTest --tests "..."` |

## Requisitos

- Extensión **Groovy Language Support** instalada en el editor
- Node.js para compilar la extensión

## Desarrollo

Para modificar la extensión:

```bash
cd .vscode/extensions/grails-test-runner
npm install
npm run watch  # Compila automáticamente al guardar
```
