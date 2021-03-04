const pkg = require("../package.json");
const { execSync } = require("child_process");

execSync(
  `git add package.json && git commit -m "${pkg.name} ${pkg.version}" && git push`
);
