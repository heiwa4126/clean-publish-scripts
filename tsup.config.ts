import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/main.ts", "src/core.ts"],
	format: ["esm", "cjs"],
	outDir: "dist",
	bundle: false,
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: {
		resolve: true,
		entry: ["src/main.ts", "src/core.ts"],
	},
});
