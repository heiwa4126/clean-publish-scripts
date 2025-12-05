#!/usr/bin/env node

import process from "node:process";
import pkg from "../package.json" with { type: "json" };
import { cleanPackage, restorePackage } from "./lib.js";

function executeWithErrorHandling(fn: () => void): void {
	try {
		fn();
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exit(1);
	}
}

function main(): void {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		console.log(
			`Version ${pkg.version}

A CLI tool to clean package.json during npm publish by removing development-specific fields.

Usage: clean-publish-scripts [options]

Running without options shows this help message.

Options:
  -c, --clean   Clean package.json (create backup and remove dev fields)
  -r, --restore Restore package.json from backup
  -h, --help    Show this help message

Examples:
  clean-publish-scripts -c  # Clean package.json (for prepack)
  clean-publish-scripts -r  # Restore package.json (for postpack)`,
		);
		return;
	}

	const hasRestore = args.includes("-r") || args.includes("--restore");
	const hasClean = args.includes("-c") || args.includes("--clean");

	if (hasRestore) {
		executeWithErrorHandling(restorePackage);
	} else if (hasClean) {
		executeWithErrorHandling(cleanPackage);
	} else {
		console.error("Error: Invalid option. Use -h for help.");
		process.exit(1);
	}
}

main();
