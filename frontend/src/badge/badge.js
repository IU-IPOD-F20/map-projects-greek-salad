import { makeBadge, ValidationError } from "badge-maker";

const snapshotTests = {
  label: "snapshot tests",
  message: "5 passed, 0 failed",
  color: "green",
};

const integrationTests = {
  label: "integration tests",
  message: "6 passed, 0 failed",
  color: "green",
};

const coverage = {
  label: "coverage",
  message: "82%",
  color: "yellow",
};

const createBadge = () => {
  // const svgSnapshot = makeBadge(snapshotTests);
  const svgIntegation = makeBadge(integrationTests);
  const svgCoverage = makeBadge(coverage);
  // console.log(svgSnapshot);
  try {
    makeBadge(integrationTests);
  } catch (e) {
    console.log(e); // ValidationError: Field `message` is required
  }
};

export default createBadge;
