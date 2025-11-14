# Agent Rules for clean-publish-scripts

## Project Overview

This is a TypeScript CLI tool that simplifies npm package publishing by cleaning package.json files. The tool removes development-specific fields (`scripts`, `workspaces`, `private`) during the publish process and restores them afterward.

## Architecture

- **Language**: TypeScript (ES modules)
- **Build Tool**: tsup
- **Test Framework**: vitest
- **Linter**: biome
- **Package Manager**: pnpm

## Key Files

- `src/core.ts`: Core functionality (cleanPackage, restorePackage)
- `src/main.ts`: CLI entry point with argument parsing
- `test/core.test.ts`: Unit tests using temporary directories
- `package.json`: Dual ESM/CJS exports with CLI bin entry

## Development Guidelines

1. **Code Style**: Follow existing TypeScript patterns, use biome for formatting
2. **Testing**: All core functions must have unit tests in `test/` directory
3. **Safety**: Tests must use temporary directories to avoid affecting project files
4. **CLI Design**: Require explicit options (-c for clean, -r for restore) to prevent accidental execution
5. **Build Process**: Use `pnpm run build` which includes lint, test, clean, build, and smoke-test

## Current Implementation

- CLI requires explicit `-c/--clean` or `-r/--restore` options
- Backup file is hardcoded to `package.json.bak`
- Removes exactly 3 fields: `scripts`, `workspaces`, `private`
- Uses synchronous file operations for simplicity

## TODO Items

- Add option to specify custom backup filename
- Consider adding more configurable fields to remove

## Scripts Usage

- `prepack`: `clean-publish-scripts -c`
- `postpack`: `clean-publish-scripts -r`