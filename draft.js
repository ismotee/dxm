const TestsDraft = require("./testsDraft.js");
const ComponentDraft = require("./componentDraft.js");
class Draft {
  constructor() {
    this.testsDraft = new TestsDraft();
    this.componentDraft = new ComponentDraft();
  }

  create(settings) {
    try {
      this.testsDraft.create(settings);
      this.componentDraft.create(settings);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  writeToFile() {
    this.testsDraft.writeToFile();
    this.componentDraft.writeToFile();
  }
}

module.exports = Draft;
