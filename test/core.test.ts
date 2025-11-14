import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanPackage, restorePackage } from "../src/core.js";

describe("core", () => {
	const testDir = "tmp";
	const testPackageJson = {
		name: "test-package",
		version: "1.0.0",
		scripts: { build: "echo build" },
		workspaces: ["."],
		private: true,
		dependencies: { lodash: "^4.0.0" },
	};

	beforeEach(() => {
		fs.mkdirSync(testDir, { recursive: true });
		process.chdir(testDir);
		fs.writeFileSync("package.json", JSON.stringify(testPackageJson, null, "\t"));
	});

	afterEach(() => {
		process.chdir("..");
		fs.rmSync(testDir, { recursive: true, force: true });
	});

	it("should clean package.json and create backup", () => {
		cleanPackage();

		expect(fs.existsSync("package.json.bak")).toBe(true);

		const cleaned = JSON.parse(fs.readFileSync("package.json", "utf8"));
		expect(cleaned.scripts).toBeUndefined();
		expect(cleaned.workspaces).toBeUndefined();
		expect(cleaned.private).toBeUndefined();
		expect(cleaned.name).toBe("test-package");
		expect(cleaned.dependencies).toEqual({ lodash: "^4.0.0" });
	});

	it("should restore package.json from backup", () => {
		cleanPackage();
		restorePackage();

		expect(fs.existsSync("package.json.bak")).toBe(false);

		const restored = JSON.parse(fs.readFileSync("package.json", "utf8"));
		expect(restored).toEqual(testPackageJson);
	});
});
