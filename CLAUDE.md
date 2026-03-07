# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grails Test Runner is a VS Code extension that provides CodeLens integration for running Grails/Spock tests. It adds "Run Test" and "Rerun Test" buttons above test methods and classes in `*Spec.groovy`, `*Tests.groovy`, and `*Test.groovy` files, executing them via `./gradlew` in the integrated terminal.

## Build & Development Commands

- `npm install` — install dependencies
- `npm run compile` — compile TypeScript (`tsc -p ./`)
- `npm run watch` — auto-compile on save
- `npx @vscode/vsce package` — build `.vsix` for distribution
- Press `F5` in VS Code to launch the Extension Development Host for testing

There is no test framework configured for this project itself.

## Architecture

The extension is split into four source files under `src/`, compiled to `out/`:

- **`constants.ts`** — `CLASS_REGEX` and `METHOD_REGEX` used to detect Spec/Test classes and test methods in Groovy files.

- **`codeLensProvider.ts`** — `GrailsTestCodeLensProvider` implements `vscode.CodeLensProvider`. Parses Groovy files with regex to find Spec/Test classes and `void "..."()` test methods. Emits four CodeLens actions per scope: Run/Rerun for individual tests and for the full class. Determines test type (unit vs integration) from the file path (`integration-test` substring → `integrationTest` task, otherwise `test`).

- **`testRunner.ts`** — `runGradleTest()` builds and sends `./gradlew <testType> --tests "<className>[.testName*]"` to a reusable "Grails Tests" terminal. Accepts an optional `--rerun-tasks` flag to bypass Gradle's UP-TO-DATE cache.

- **`extension.ts`** — Entry point. `activate()` registers the CodeLensProvider (pattern `**/*{Spec,Tests,Test}.groovy`) and the four commands: `runTest`, `runTestClass`, `rerunTest`, `rerunTestClass`.

## Extension Activation

Activates on `onLanguage:groovy` or when the workspace contains `*Spec.groovy`, `*Tests.groovy`, or `*Test.groovy` files (see `activationEvents` in `package.json`).

## Notes

- Comments in the source code are in Spanish.
- TypeScript strict mode is enabled.
