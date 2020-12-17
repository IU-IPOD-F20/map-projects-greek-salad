const fs = require("fs");
const { makeBadge, ValidationError } = require("badge-maker");

const dataPath = require("path").resolve(__dirname, "report.json");

let rawdata = fs.readFileSync(dataPath);
const { numPassedTests, numFailedTests } = JSON.parse(rawdata);

const svg = makeBadge({
  label: "snapshot tests",
  message: `${numPassedTests} passed, ${numFailedTests} failed`,
  color: "green",
});

fs.writeFile(require("path").resolve(__dirname, "./img/snapshot.svg"), svg, () => {});
