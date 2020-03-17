const fs = require("fs");

class Draft {
  constructor() {
    this.template = {
      class: {
        reactImport: ["import React, { PureComponents } from 'react';"],
        generateComponentDeclaration: name => `const ${name} = (props) => {`,
        generateExport: defaultExportGenerator
      },
      function: {
        reactImport: `import React from 'react'`,
        generateComponentDeclaration: name => `const ${name} = (props) => {`,
        generateExport: defaultExportGenerator
      }
    };

    function defaultExportGenerator(name) {
      return `export default ${name};`;
    }
  }
  get draft() {
    return { ...this._draft };
  }

  set draft(d) {
    this._draft = d;
  }

  create(settings) {
    try {
      this.generateDraft(settings);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  generateDraft(settings) {
    const t = { ...this.template[settings.type] };
    t.name = settings.name;
    if (!t) throw new Error(`Illegal type: ${settings.type}`);
    this.generateComponentStrings(t, settings.name);
  }

  generateComponentStrings(temp, name) {
    if (!name) throw new Error("Componen missing name.");
    temp.componentDeclaration = temp.generateComponentDeclaration(name);
    temp.exportStr = temp.generateExport(name);
    this.draft = temp;
  }

  writeToFile() {
    this.parseContent();
    this.writeContentToFile();
  }

  parseContent() {
    const {
      reactImport,
      imports,
      componentDeclaration,
      exportStr
    } = this.draft;

    this.componentContent = `${reactImport}
  ${imports}
  
  ${componentDeclaration}

  };

  ${exportStr}
  `;
  }

  writeContentToFile() {
    const componentFileName = `./src/components/${this.draft.name}/${this.draft.name}.js`;
    fs.writeFileSync(componentFileName, this.componentContent, { flag: "w+" });
  }
}

module.exports = Draft;
