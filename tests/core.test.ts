import fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanPackage, restorePackage } from "../src/lib.js";

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

	it("should remove dependencies matching namespace pattern", () => {
		const testPkgWithNamespace = {
			name: "test-package",
			version: "1.0.0",
			scripts: { build: "echo build" },
			dependencies: {
				"@myorg/package-a": "^1.0.0",
				"@myorg/package-b": "^2.0.0",
				lodash: "^4.0.0",
				"@otherorg/package-c": "^3.0.0",
			},
			devDependencies: {
				"@myorg/dev-tool": "^1.0.0",
				vitest: "^1.0.0",
			},
			peerDependencies: {
				"@myorg/peer-dep": "^1.0.0",
				react: "^18.0.0",
			},
			optionalDependencies: {
				"@myorg/optional": "^1.0.0",
				fsevents: "^2.0.0",
			},
		};

		fs.writeFileSync("package.json", JSON.stringify(testPkgWithNamespace, null, "\t"));

		cleanPackage("myorg");

		const cleaned = JSON.parse(fs.readFileSync("package.json", "utf8"));

		// @myorg/* dependencies should be removed
		expect(cleaned.dependencies).toEqual({
			lodash: "^4.0.0",
			"@otherorg/package-c": "^3.0.0",
		});
		expect(cleaned.devDependencies).toEqual({
			vitest: "^1.0.0",
		});
		expect(cleaned.peerDependencies).toEqual({
			react: "^18.0.0",
		});
		expect(cleaned.optionalDependencies).toEqual({
			fsevents: "^2.0.0",
		});

		// scripts should also be removed
		expect(cleaned.scripts).toBeUndefined();
	});

	it("should restore all dependencies including namespace ones from backup", () => {
		const testPkgWithNamespace = {
			name: "test-package",
			version: "1.0.0",
			dependencies: {
				"@myorg/package-a": "^1.0.0",
				lodash: "^4.0.0",
			},
		};

		fs.writeFileSync("package.json", JSON.stringify(testPkgWithNamespace, null, "\t"));

		cleanPackage("myorg");
		restorePackage();

		const restored = JSON.parse(fs.readFileSync("package.json", "utf8"));
		expect(restored).toEqual(testPkgWithNamespace);
		expect(restored.dependencies["@myorg/package-a"]).toBe("^1.0.0");
	});

	it("should work normally without namespace option", () => {
		const testPkgWithNamespace = {
			name: "test-package",
			version: "1.0.0",
			scripts: { build: "echo build" },
			dependencies: {
				"@myorg/package-a": "^1.0.0",
				lodash: "^4.0.0",
			},
		};

		fs.writeFileSync("package.json", JSON.stringify(testPkgWithNamespace, null, "\t"));

		cleanPackage(); // Without namespace

		const cleaned = JSON.parse(fs.readFileSync("package.json", "utf8"));

		// @myorg/* dependencies should NOT be removed
		expect(cleaned.dependencies).toEqual({
			"@myorg/package-a": "^1.0.0",
			lodash: "^4.0.0",
		});
		// Only scripts should be removed
		expect(cleaned.scripts).toBeUndefined();
	});
});
