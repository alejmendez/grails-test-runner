# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grails Test Runner is a VS Code extension that provides CodeLens integration for running Grails/Spock tests. It adds "Run Test" and "Rerun Test" buttons above test methods and classes in `*Spec.groovy` files, executing them via `./gradlew` in the integrated terminal.

## Build & Development Commands

- `npm install` — install dependencies
- `npm run compile` — compile TypeScript (`tsc -p ./`)
- `npm run watch` — auto-compile on save
- `npx @vscode/vsce package` — build `.vsix` for distribution
- Press `F5` in VS Code to launch the Extension Development Host for testing

## Architecture

This is a single-file extension. All logic lives in `src/extension.ts`, compiled to `out/extension.js`.

**Key components in `src/extension.ts`:**

- **`GrailsTestCodeLensProvider`** — implements `vscode.CodeLensProvider`. Parses Groovy files using regex to find Spec classes (`CLASS_REGEX`) and test methods (`METHOD_REGEX`). Provides CodeLens actions for run/rerun of individual tests and full classes. Detects test type (unit vs integration) based on file path (`src/test/groovy/` vs `src/integration-test/groovy/`).

- **`runGradleTest()`** — builds and executes `./gradlew test --tests "..."` or `./gradlew integrationTest --tests "..."` commands in a reusable "Grails Tests" terminal. Supports `--rerun-tasks` flag to bypass Gradle cache.

- **`activate()`** — registers the CodeLens provider (scoped to `**/*Spec.groovy`) and four commands: `runTest`, `runTestClass`, `rerunTest`, `rerunTestClass`.

## Extension Activation

Activates on Groovy language files or when workspace contains `*Spec.groovy` files (see `package.json` `activationEvents`).

## Notes

- No test framework is configured for this project itself
- Comments in the source code are in Spanish
- TypeScript strict mode is enabled
