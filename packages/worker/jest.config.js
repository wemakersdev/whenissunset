module.exports = {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "miniflare",
  "transform": {
    "^.+\\.tsx?$": [ 
      "esbuild-jest", 
      { 
        sourcemap: true,
      } 
    ],
    "\\.html$": "jest-raw-loader"
  }
};
