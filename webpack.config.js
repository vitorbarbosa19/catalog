const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const TerserPlugin = require("terser-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const packageJson = require("./package.json");

module.exports = (env, { mode }) => {
    const config = {
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    // exclude: /node_modules/,
                    loader: "ts-loader",
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                            plugins: ["@babel/plugin-transform-runtime"],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "raw-loader"],
                },
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        safari10: true,
                        mangle: true,
                    },
                }),
            ],
        },
        plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
    };
    if (mode === "development") {
        config.resolve.alias = require("./componentAliasing");
        config.resolve.modules = [path.resolve(__dirname, "./node_modules")];
        const {
            sheet_url,
            sheet_token,
            sheet_id_preleads_append,
            sheet_id_storeowners,
            sheet_id_tags_get,
            sheet_id_transactions,
            cnpj_url,
            cnpj_token,
            continue_url,
            pay,
            pay_token,
            nextcode_email,
            nextcode_password,
            nextcode_token_v2,
            whats_url,
            whats_token,
            holder,
            expiry,
            number,
            cvv,
            pay_testing,
            pay_token_testing,
            seller_id_ziro,
            sheet_id_support,
            homolog,
        } = require("./credentials");
        config.devServer = { historyApiFallback: true };
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env": {
                    SHEET_URL: JSON.stringify(sheet_url),
                    SHEET_TOKEN: JSON.stringify(sheet_token),
                    SHEET_ID_PRELEADS_APPEND: JSON.stringify(sheet_id_preleads_append),
                    SHEET_ID_STOREOWNERS: JSON.stringify(sheet_id_storeowners),
                    SHEET_ID_TAGS_GET: JSON.stringify(sheet_id_tags_get),
                    SHEET_ID_TRANSACTIONS: JSON.stringify(sheet_id_transactions),
                    CNPJ_URL: JSON.stringify(cnpj_url),
                    CNPJ_TOKEN: JSON.stringify(cnpj_token),
                    CONTINUE_URL: JSON.stringify(continue_url),
                    PAY: JSON.stringify(pay),
                    PAY_TOKEN: JSON.stringify(pay_token),
                    NEXTCODE_EMAIL: JSON.stringify(nextcode_email),
                    NEXTCODE_PASSWORD: JSON.stringify(nextcode_password),
                    NEXTCODE_TOKEN_V2: JSON.stringify(nextcode_token_v2),
                    WHATS_URL: JSON.stringify(whats_url),
                    WHATS_TOKEN: JSON.stringify(whats_token),
                    SELLER_ID_ZIRO: JSON.stringify(seller_id_ziro),
                    SHEET_ID_SUPPORT: JSON.stringify(sheet_id_support),
                    // BELOW DEV ONLY
                    HOLDER: JSON.stringify(holder), // DEV ONLY
                    EXPIRY: JSON.stringify(expiry), // DEV ONLY
                    NUMBER: JSON.stringify(number), // DEV ONLY
                    CVV: JSON.stringify(cvv), // DEV ONLY
                    PAY_TESTING: JSON.stringify(pay_testing), // DEV ONLY
                    PAY_TOKEN_TESTING: JSON.stringify(pay_token_testing), // DEV ONLY
                    // FOR DEV TESTS ONLY
                    HOMOLOG: JSON.stringify(homolog),
                },
            }),
            new HardSourceWebpackPlugin(),
        );
    }
    if (mode === "production") {
        config.plugins.push(
            new CompressionPlugin(),
            new CopyWebpackPlugin([
                { from: "./_redirects", to: "_redirects", toType: "file" },
                { from: "./src/sw.js", to: "sw.js", toType: "file" },
            ]),
            new WebpackPwaManifest({
                name: "Catalogo",
                short_name: "Catalogo",
                start_url: "/",
                background_color: "#FFF",
                theme_color: "#FFF",
                display: "standalone",
                icons: [{ src: "./logo.png", sizes: [96, 128, 192, 256, 384, 512] }],
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    SHEET_URL: JSON.stringify(process.env.SHEET_URL),
                    SHEET_TOKEN: JSON.stringify(process.env.SHEET_TOKEN),
                    SHEET_ID_PRELEADS_APPEND: JSON.stringify(process.env.SHEET_ID_PRELEADS_APPEND),
                    SHEET_ID_STOREOWNERS: JSON.stringify(process.env.SHEET_ID_STOREOWNERS),
                    SHEET_ID_TAGS_GET: JSON.stringify(process.env.SHEET_ID_TAGS_GET),
                    SHEET_ID_TRANSACTIONS: JSON.stringify(process.env.SHEET_ID_TRANSACTIONS),
                    CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
                    CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN),
                    CONTINUE_URL: JSON.stringify(process.env.CONTINUE_URL),
                    PAY: JSON.stringify(process.env.PAY),
                    PAY_TOKEN: JSON.stringify(process.env.PAY_TOKEN),
                    NEXTCODE_EMAIL: JSON.stringify(process.env.NEXTCODE_EMAIL),
                    NEXTCODE_PASSWORD: JSON.stringify(process.env.NEXTCODE_PASSWORD),
                    NEXTCODE_TOKEN_V2: JSON.stringify(process.env.NEXTCODE_TOKEN_V2),
                    WHATS_URL: JSON.stringify(process.env.WHATS_URL),
                    WHATS_TOKEN: JSON.stringify(process.env.WHATS_TOKEN),
                    SELLER_ID_ZIRO: JSON.stringify(process.env.SELLER_ID_ZIRO),
                    SHEET_ID_SUPPORT: JSON.stringify(process.env.SHEET_ID_SUPPORT),
                },
            }),
        );
        if (process.env.SENTRY_TOKEN) {
            config.plugins.push(
                new SentryWebpackPlugin({
                    // sentry-cli configuration
                    authToken: process.env.SENTRY_TOKEN,
                    org: "ziro-qd",
                    project: "ziro-qd",
                    release: packageJson.version,

                    // webpack specific configuration
                    include: ".",
                    ignore: ["node_modules", "webpack.config.js"],
                }),
            );
        }
    }
    return config;
};
