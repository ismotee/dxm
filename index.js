const fs = require("fs");
const path = require("path");
const Draft = require("./draft.js");
const yaml = require("js-yaml");

module.exports = function(argv) {
  const fileName = argv.name;

  checkExecPath();
  createFolderIfNotExist("./src/components");
  const draft = makeDraft(fileName);
  draft.writeToFile();
};

function checkExecPath() {
  if (!fs.existsSync("./src"))
    throw new Error("dxm wasn't executed in project root folder.");
}

function createFolderIfNotExist(folder) {
  if (!fs.existsSync(folder)) {
    console.log(`${folder} not found. Creating folder.`);
    fs.mkdirSync(folder);
  }
}

function makeDraft(fileName) {
  const draftSettings = importDraftSettings(fileName);
  const draft = new Draft();
  draft.create(draftSettings);
  return draft;
}

function importDraftSettings(fn) {
  const file = makeFileNameExtensionAgnostic(fn);
  ensureDraftSettingsFileExists(file);
  return yaml.safeLoad(fs.readFileSync(file, "utf8"));
}

function makeFileNameExtensionAgnostic(fn) {
  const name = fn.replace(".yml", "");
  return path.join(process.cwd(), `${name}.yml`);
}

function ensureDraftSettingsFileExists(fn) {
  try {
    checkCriticalResource(fn);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function checkCriticalResource(res) {
  if (!fs.existsSync(res)) throw new Error("Cannot find resource:", res);
}
