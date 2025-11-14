#!/usr/bin/env node

import process from "node:process";
import { cleanPackage, restorePackage } from "./core.js";

function main() {
	const isRestore = process.argv.includes("-r");

	if (isRestore) {
		restorePackage();
	} else {
		cleanPackage();
	}
}

main();
