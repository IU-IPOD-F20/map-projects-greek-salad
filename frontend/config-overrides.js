const {
  disableEsLint,
  addDecoratorsLegacy,
  override,
} = require("customize-cra");

module.exports = {
  webpack: override(
    // usual webpack plugin
    disableEsLint(),
    addDecoratorsLegacy()
  ),
};
