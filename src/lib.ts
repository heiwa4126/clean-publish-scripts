import fs from "node:fs";

const BACKUP_FILE = "package.json.bak";
const PACKAGE_FILE = "package.json";

/**
 * Cleans the package.json file by removing development-specific fields.
 *
 * This function creates a backup of the original package.json file, then removes
 * the `scripts`, `workspaces`, and `private` fields from it. The cleaned version
 * is written back to the package.json file with tab indentation.
 *
 * @param namespace - Optional namespace to remove from dependencies (without @ prefix).
 *                    When specified, removes all dependencies matching "@namespace/*" pattern
 *                    from dependencies, devDependencies, peerDependencies, and optionalDependencies.
 *
 * @throws {Error} If the package.json file cannot be read, backed up, or written.
 * The error message includes details about the underlying failure.
 *
 * @remarks
 * - A backup is created at the path specified by `BACKUP_FILE`
 * - The output uses tab characters for indentation
 * - Fields removed: `scripts`, `workspaces`, `private`
 * - If namespace is provided, dependencies matching "@namespace/*" are also removed
 */
export function cleanPackage(namespace?: string) {
	try {
		// Create backup
		fs.copyFileSync(PACKAGE_FILE, BACKUP_FILE);

		// Clean package.json
		const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, "utf8"));
		delete pkg.scripts;
		delete pkg.workspaces;
		delete pkg.private;

		// Remove namespace dependencies if specified
		if (namespace) {
			const prefix = `@${namespace}/`;
			const depSections = [
				"dependencies",
				"devDependencies",
				"peerDependencies",
				"optionalDependencies",
			] as const;

			for (const section of depSections) {
				if (pkg[section]) {
					for (const key of Object.keys(pkg[section])) {
						if (key.startsWith(prefix)) {
							delete pkg[section][key];
						}
					}
				}
			}
		}

		fs.writeFileSync(PACKAGE_FILE, `${JSON.stringify(pkg, null, "\t")}\n`);
	} catch (error) {
		throw new Error(
			`Failed to clean package.json: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Restores the original package.json file from its backup.
 *
 * This function renames the backup file back to package.json, effectively
 * restoring the original package configuration. If the restoration fails,
 * an error is thrown with details about the failure.
 *
 * @throws {Error} When the backup file cannot be renamed or restored to package.json
 *
 * @example
 * ```typescript
 * try {
 *   restorePackage();
 *   console.log('Package restored successfully');
 * } catch (error) {
 *   console.error('Failed to restore package:', error);
 * }
 * ```
 */
export function restorePackage() {
	try {
		// Restore from backup
		fs.renameSync(BACKUP_FILE, PACKAGE_FILE);
	} catch (error) {
		throw new Error(
			`Failed to restore package.json: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
