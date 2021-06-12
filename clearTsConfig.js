const fs = require("fs");
const path = require("path");
const tsconfig = require("./tsconfig.json");

delete tsconfig.compilerOptions.paths;

fs.writeFileSync(path.resolve(__dirname, "tsconfig.json"), JSON.stringify(tsconfig, null, 4));
