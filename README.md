# clean-publish-scripts (@heiwa4126/clean-publish-scripts)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/clean-publish-scripts.svg)](https://www.npmjs.com/package/@heiwa4126/clean-publish-scripts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

A simple CLI tool to clean package.json during npm publish by removing development-specific fields like `scripts`, `workspaces`, and `private`.

## Installation

```sh
npm install -D @heiwa4126/clean-publish-scripts
```

## Usage

Replace complex npm scripts:

**Before:**

```json
{
  "scripts": {
    "prepack": "cp package.json package.json.bak && scripts/something-cleaning-package.sh",
    "postpack": "mv package.json.bak package.json"
  }
}
```

**After:**

```json
{
  "scripts": {
    "prepack": "clean-publish-scripts -c",
    "postpack": "clean-publish-scripts -r"
  }
}
```

## How it works

- `clean-publish-scripts -c`: Creates a backup of package.json and removes `scripts`, `workspaces`, and `private` fields
- `clean-publish-scripts -r`: Restores package.json from the backup

## Options

- `-c, --clean`: Clean package.json (create backup and remove dev fields)
- `-r, --restore`: Restore package.json from backup
- `-h, --help`: Show help message

## TODO

- Add option to specify custom backup filename (currently hardcoded to `package.json.bak`)

## License

MIT

## Development

```sh
pnpm i
#
pnpm run prepublishOnly # lint, test, build and smoke test
pnpm pack # prepack, pack and postpack
```
