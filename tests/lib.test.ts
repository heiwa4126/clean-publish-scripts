import assert from "node:assert";
import fs from "node:fs";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cleanPackage, restorePackage } from "../src/lib.js";

describe("lib", () => {
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

		assert.strictEqual(fs.existsSync("package.json.bak"), true);

		const cleaned = JSON.parse(fs.readFileSync("package.json", "utf8"));
		assert.strictEqual(cleaned.scripts, undefined);
		assert.strictEqual(cleaned.workspaces, undefined);
		assert.strictEqual(cleaned.private, undefined);
		assert.strictEqual(cleaned.name, "test-package");
		assert.deepStrictEqual(cleaned.dependencies, { lodash: "^4.0.0" });
	});

	it("should restore package.json from backup", () => {
		cleanPackage();
		restorePackage();

		assert.strictEqual(fs.existsSync("package.json.bak"), false);

		const restored = JSON.parse(fs.readFileSync("package.json", "utf8"));
		assert.deepStrictEqual(restored, testPackageJson);
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
		assert.deepStrictEqual(cleaned.dependencies, {
			lodash: "^4.0.0",
			"@otherorg/package-c": "^3.0.0",
		});
		assert.deepStrictEqual(cleaned.devDependencies, {
			vitest: "^1.0.0",
		});
		assert.deepStrictEqual(cleaned.peerDependencies, {
			react: "^18.0.0",
		});
		assert.deepStrictEqual(cleaned.optionalDependencies, {
			fsevents: "^2.0.0",
		});

		// scripts should also be removed
		assert.strictEqual(cleaned.scripts, undefined);
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
		assert.deepStrictEqual(restored, testPkgWithNamespace);
		assert.strictEqual(restored.dependencies["@myorg/package-a"], "^1.0.0");
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
		assert.deepStrictEqual(cleaned.dependencies, {
			"@myorg/package-a": "^1.0.0",
			lodash: "^4.0.0",
		});
		// Only scripts should be removed
		assert.strictEqual(cleaned.scripts, undefined);
	});
});
