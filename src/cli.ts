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

function printHelp() {
	console.log(
		`A CLI tool to clean package.json during npm publish by removing development-specific fields.

Usage: clean-publish-scripts [options]

Running without options shows this help message.

Options:
  -c, --clean              Clean package.json (create backup and remove dev fields)
  -r, --restore            Restore package.json from backup
  -n, --namespace <scope>  Remove dependencies matching @<scope>/* pattern
                           (use with --clean, without @ prefix)
  -h, --help               Show this help message
  -v, --version            Show version

Examples:
  clean-publish-scripts -c                    # Clean package.json (for prepack)
  clean-publish-scripts -c --namespace myorg  # Clean and remove @myorg/* dependencies
  clean-publish-scripts -r                    # Restore package.json (for postpack)`,
	);
}

function printVersion() {
	console.log(String(pkg.version));
}

function main(): void {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		printHelp();
		return;
	}
	if (args.includes("-v") || args.includes("--version")) {
		printVersion();
		return;
	}

	const hasRestore = args.includes("-r") || args.includes("--restore");
	const hasClean = args.includes("-c") || args.includes("--clean");

	// Parse --namespace option
	let namespace: string | undefined;
	const namespaceIndex = args.findIndex((arg) => arg === "-n" || arg === "--namespace");
	if (namespaceIndex !== -1 && args[namespaceIndex + 1]) {
		namespace = args[namespaceIndex + 1];
		if (namespace?.includes("@")) {
			console.error(
				"Error: namespace should not include '@' symbol. Use 'myorg' instead of '@myorg'.",
			);
			process.exit(1);
		}
	}

	if (hasRestore) {
		executeWithErrorHandling(restorePackage);
	} else if (hasClean) {
		executeWithErrorHandling(() => cleanPackage(namespace));
	} else {
		console.error("Error: Invalid option. Use -h for help.");
		process.exit(1);
	}
}

main();
