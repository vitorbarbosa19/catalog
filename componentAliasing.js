const fs = require("fs");
const path = require("path");
const tsconfig = require("./tsconfig.json");

let bitmap = fs.readFileSync("../components/.bitmap").toString();

const index = bitmap.indexOf("*/");

bitmap = JSON.parse(bitmap.slice(index + 2));

const aliases = {};
tsconfig.compilerOptions.paths = {};

Object.entries(bitmap).forEach(([dep, { mainFile, files }]) => {
    if (!dep.startsWith("vitorbarbosa19")) return;
    const moduleName = `@bit/${dep.split("@")[0].replace(/\//g, ".")}`;
    const alias = path.resolve(__dirname, `../components/${mainFile.split("/").slice(0, -1).join("/")}`);
    aliases[`${moduleName}$`] = alias;
    tsconfig.compilerOptions.paths[`${moduleName}`] = [alias];
    tsconfig.compilerOptions.paths[`${moduleName}/dist/*`] = [`${alias}/*`];
    if (files) {
        files.forEach(({ relativePath }) => {
            const fileName = `${moduleName}/dist/${relativePath.replace("src/components/", "").split(".")[0]}`;
            const filesAlias = path.resolve(__dirname, `../components/${relativePath}`);
            aliases[`${fileName}$`] = filesAlias;
        });
    }
});

aliases["ziro-messages$"] = path.resolve(__dirname, "../messages");
aliases["ziro-messages/dist"] = path.resolve(__dirname, "../messages");
tsconfig.compilerOptions.paths["ziro-messages"] = [path.resolve(__dirname, "../messages")];
tsconfig.compilerOptions.paths["ziro-messages/dist/*"] = [path.resolve(__dirname, "../messages/*")];

fs.writeFileSync(path.resolve(__dirname, "aliases.json"), JSON.stringify(aliases, null, 4));
fs.writeFileSync(path.resolve(__dirname, "tsconfig.json"), JSON.stringify(tsconfig, null, 4));

aliases["@bit/ziro.firebase.user-status"] = path.resolve(__dirname, "../componentsv2/components/firebase/userStatus");
aliases["@bit/ziro.firebase.catalog-user-data"] = path.resolve(__dirname, "../componentsv2/components/firebase/catalogUserData");
aliases["@bit/ziro.firebase.storeowner-data"] = path.resolve(__dirname, "../componentsv2/components/firebase/storeownerData");

module.exports = aliases;
