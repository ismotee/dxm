const fs = require("fs");

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const template = {
  imports: `import React from 'react';
import {shallow} from 'enzyme';`,
  generateComponentImport: name => `import ${name} from './${name}';`,
  generateMainDescribe: name => `describe("${name}", () => {`,
  closeDescribe: `});`
};

class TestsDraft {
  constructor() {
    this.template = { ...template };
  }

  create(settings) {
    this.generateTests(settings);
  }

  generateTests(settings) {
    this.validateSettings(settings);
    this.componentName = settings.name;
    this.generateImportsAndMainDescribe(settings);
    this.generateTestsStrings(settings);
  }

  validateSettings(s) {
    if (!s.name) throw new Error("Settings has no name attribute.");
    if (!s.type) throw new Error("Settings has no type attribute.");
  }

  generateImportsAndMainDescribe(s) {
    this.imports = this.template.imports;
    this.componentImport = this.template.generateComponentImport(s.name);
    this.mainDescribe = this.template.generateMainDescribe(s.name);
    this.closeDescribe = this.template.closeDescribe;
  }

  generateTestsStrings(s) {
    (s.tests || []).forEach(test => {
      const expectStrings = Object.keys(test.then || {}).map(
        then => `expect(wrapper.)`
      );
      const testString = `describe("given ${test.given}, when ${
        test.when.event
      }", () => {
    let props = ${test.props};
    let wrapper = shallow(<${this.componentName} {...props} />);
    const component = wrapper.find('#${test.when.event.split(".")[0]}');
    component.simulate(${test.when.event.split(".")[1]});

    test("then it should ${test.then.toString()}", () => {
      
    });
  });`;
    });
  }

  writeToFile() {
    this.parseContent();
    this.writeContentToFile();
  }

  parseContent() {
    this.fileContent = `${this.imports}
${this.componentImport}

${this.mainDescribe}
${this.closeDescribe}
`;
  }

  writeContentToFile() {
    const testsFileName = `./src/components/${this.componentName}/${this.componentName}.test.js`;
    fs.writeFileSync(testsFileName, this.fileContent, { flag: "w+" });
  }
}

module.exports = TestsDraft;
