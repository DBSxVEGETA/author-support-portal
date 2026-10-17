const fs = require("fs"),
  path = require("path"),
  YAML = require("yaml");
module.exports = YAML.parse(
  fs.readFileSync(path.join(__dirname, "openapi.yaml"), "utf8"),
);
