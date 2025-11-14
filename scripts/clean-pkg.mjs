import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
delete pkg.scripts;
delete pkg.workspaces;
delete pkg.private;
fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, "\t")}\n`);
