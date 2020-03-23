const fs = require("fs");

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function defaultExportGenerator(name) {
  return `export default ${name};`;
}

const templates = {
  class: {
    reactImport: `import React, { PureComponent } from "react";`,
    generateComponentDeclaration: name =>
      `class ${name} extends PureComponent {`,
    generateExport: defaultExportGenerator,
    renderStart: `render() {
    return (`,
    renderEnd: `    )
  };`
  },
  function: {
    reactImport: `import React from "react";`,
    generateComponentDeclaration: name => `const ${name} = (props) => {`,
    generateExport: defaultExportGenerator,
    renderStart: `return (`,
    renderEnd: `);`
  }
};

class ComponentDraft {
  constructor() {
    this.templates = templates;
  }

  create(settings) {
    this.component = { ...templates[settings.type] };
    this.convertSettingsToComponent(settings);
    if (!this.component) throw new Error(`Illegal type: ${settings.type}`);
    this.generateComponentStrings();
  }

  convertSettingsToComponent(s) {
    this.component.name = s.name;
    this.component.imports = s.imports ? s.imports.join("/n") : "";
    this.component.render = s.render;
    this.insertActionsToRender(s);
  }

  insertActionsToRender(s) {
    Object.keys(s.actions || {}).forEach(element => {
      const actionsOfElement = s.actions[element];
      const renderArray = this.component.render.split(element);
      Object.keys(actionsOfElement).forEach(action => {
        renderArray[1] = renderArray[1].splice(
          1,
          0,
          ` ${action}={(e) => ${actionsOfElement[action]}(e)}`
        );
        renderArray[0] += element;
      });
      this.component.render = renderArray.join("");
    });
  }

  generateComponentStrings() {
    if (!this.component.name) throw new Error("Component missing name.");
    this.component.componentDeclaration = this.component.generateComponentDeclaration(
      this.component.name
    );
    this.component.exportStr = this.component.generateExport(
      this.component.name
    );
    this.component = this.component;
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
      renderStart,
      render,
      renderEnd,
      exportStr
    } = this.component;
    this.componentContent = `${reactImport}
${imports}
${componentDeclaration}
  ${renderStart}
    ${render}
  ${renderEnd}
};

${exportStr}
`;
  }

  writeContentToFile() {
    const componentFileName = `./src/components/${this.component.name}/${this.component.name}.js`;
    fs.writeFileSync(componentFileName, this.componentContent, { flag: "w+" });
  }
}

module.exports = ComponentDraft;
