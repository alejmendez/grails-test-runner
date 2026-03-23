# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

## [0.1.4] — 2026-03-22

### Added
- Archivo CHANGELOG.md con historial completo de versiones

### Changed
- README actualizado para reflejar soporte de archivos `*Test.groovy` y `*Tests.groovy`

## [0.1.3] — 2026-03-07

### Added
- Primera suite de tests automatizados para `constants`, `codeLensProvider` y `testRunner`

## [0.1.2] — 2026-03-07

### Changed
- Refactor de `extension.ts`: separado en múltiples archivos (`constants.ts`, `codeLensProvider.ts`, `testRunner.ts`) para mejor organización del código

## [0.1.1] — 2026-03-07

### Added
- Soporte para archivos `*Test.groovy` y `*Tests.groovy` además de `*Spec.groovy`

## [0.1.0] — 2026-03-06

### Added
- Botones "Rerun Test" y "Rerun Test Class" que ejecutan los tests con el flag `--rerun-tasks` para evitar el caché UP-TO-DATE de Gradle

## [0.0.2] — 2026-01-21

### Added
- Licencia MIT
- Instrucciones para build e instalación desde el código fuente

### Changed
- README mejorado con instrucciones de instalación, descripción de features, guía de uso y pautas de contribución

## [0.0.1] — 2026-01-20

### Added
- Release inicial de la extensión
- CodeLens para ejecutar tests Grails/Spock en archivos `*Spec.groovy`
- Comandos `Run Test` y `Run Test Class` integrados con el terminal de VS Code usando `./gradlew`
- Detección automática del tipo de test: unitario (`test`) o de integración (`integrationTest`) según el path del archivo
- Icono de la extensión

[Unreleased]: https://github.com/alejmendez/grails-test-runner/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/alejmendez/grails-test-runner/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/alejmendez/grails-test-runner/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/alejmendez/grails-test-runner/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/alejmendez/grails-test-runner/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/alejmendez/grails-test-runner/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/alejmendez/grails-test-runner/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/alejmendez/grails-test-runner/releases/tag/v0.0.1
