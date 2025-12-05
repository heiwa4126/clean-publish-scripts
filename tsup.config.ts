import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["src/lib.ts"],
		format: ["esm", "cjs"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: false,
		clean: true,
		dts: true,
		minify: true,
	},
	{
		entry: ["src/cli.ts"],
		format: ["esm"],
		outDir: "dist",
		bundle: false,
		splitting: false,
		sourcemap: false,
		clean: false,
		dts: true,
		minify: true,
	},
]);
