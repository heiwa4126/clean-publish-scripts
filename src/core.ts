import fs from "node:fs";

const BACKUP_FILE = "package.json.bak";
const PACKAGE_FILE = "package.json";

export function cleanPackage() {
	// Create backup
	fs.copyFileSync(PACKAGE_FILE, BACKUP_FILE);

	// Clean package.json
	const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, "utf8"));
	delete pkg.scripts;
	delete pkg.workspaces;
	delete pkg.private;
	fs.writeFileSync(PACKAGE_FILE, `${JSON.stringify(pkg, null, "\t")}\n`);
}

export function restorePackage() {
	// Restore from backup
	fs.renameSync(BACKUP_FILE, PACKAGE_FILE);
}
