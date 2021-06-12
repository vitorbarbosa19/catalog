module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "prettier/react",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "prettier", "jsx-a11y", "import"],
    rules: {
        "no-console": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "func-names": "off",
        "prettier/prettier": "error",
        "react/prop-types": "off",
        "consistent-return": "off",
        "import/extensions": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/label-has-associated-control": "off",
        "no-underscore-dangle": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/jsx-filename-extension": [
            1,
            {
                extensions: [".tsx"],
            },
        ],
        "import/prefer-default-export": "off",
    },
    settings: {
        "import/resolver": {
            typescript: {},
        },
    },
};
