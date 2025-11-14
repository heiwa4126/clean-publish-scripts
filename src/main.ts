#!/usr/bin/env node

import process from "node:process";
import { cleanPackage, restorePackage } from "./core.js";

function main() {
	const args = process.argv;

	if (args.includes("-h") || args.includes("--help")) {
		console.log(`Usage: clean-publish-scripts [options]

Options:
  -r        Restore package.json from backup
  -h, --help Show this help message

Examples:
  clean-publish-scripts     # Clean package.json (for prepack)
  clean-publish-scripts -r  # Restore package.json (for postpack)`);
		return;
	}

	if (args.includes("-r")) {
		restorePackage();
	} else {
		cleanPackage();
	}
}

main();
