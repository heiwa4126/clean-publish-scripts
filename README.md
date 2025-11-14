# clean-publish-scripts (@heiwa4126/clean-publish-scripts)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/clean-publish-scripts.svg)](https://www.npmjs.com/package/@heiwa4126/clean-publish-scripts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

## 仕様

インストールは
```sh
npm add -D clean-publish-scripts
```

挙動は、現在run-scriptsに

```json
	"scripts": {
		"prepack": "cp package.json package.json.bak && node scripts/clean-pkg.mjs",
		"postpack": "mv package.json.bak package.json"
	}
```
と書かれているのを
```json
	"scripts": {
		"prepack": "clean-publish-scripts",
		"postpack": "clean-publish-scripts -r"
	}
```
と書けるようにしたい
