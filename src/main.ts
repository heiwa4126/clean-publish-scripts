#!/usr/bin/env node

import process from "node:process";
import { cleanPackage, restorePackage } from "./core.js";

function main() {
	const args = process.argv;

	if (args.includes("-h") || args.includes("--help") || args.length === 2) {
		console.log(`Usage: clean-publish-scripts [options]

Options:
  -c, --clean   Clean package.json (create backup and remove dev fields)
  -r, --restore Restore package.json from backup
  -h, --help    Show this help message

Examples:
  clean-publish-scripts -c  # Clean package.json (for prepack)
  clean-publish-scripts -r  # Restore package.json (for postpack)`);
		return;
	}

	if (args.includes("-r") || args.includes("--restore")) {
		restorePackage();
	} else if (args.includes("-c") || args.includes("--clean")) {
		cleanPackage();
	} else {
		console.error("Error: Invalid option. Use -h for help.");
		process.exit(1);
	}
}

main();
