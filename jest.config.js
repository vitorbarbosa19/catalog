module.exports = {
    roots: ["<rootDir>/src/__tests__"],
    testPathIgnorePatterns: ["/node_modules/", "/public/"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "./jest.setup.js"],
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
};
