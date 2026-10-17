const fs = require("fs"),
  path = require("path");

exports.loadSampleData = () => {
  const p = path.join(__dirname, "../data", "sampledata.json");
  if (!fs.existsSync(p))
    throw new Error(
      `Sample data not found at ${p}. Copy the supplied JSON there.`,
    );
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!Array.isArray(data.authors))
    throw new Error("Sample data must contain an authors array.");
  return data.authors;
};
