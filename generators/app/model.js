const rewrite = require('./util').rewrite;
const co = require('co');
const chalk = require('chalk');

function snakeToCamel(s) {
  return s.replace(/(_\w)/g, m => m[1].toUpperCase());
}

function toCapital(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildArgs(props) {
  const args = {
    tableName: props.basicName,
    modelName: snakeToCamel(props.basicName),
    interfaceName: toCapital(snakeToCamel(props.basicName)),
    pluralName: props.plural,
    properties: 'id?: string;\n    create_time?: Date;',
    inputSchema: '',
    keys: '\'id\',\n        \'create_time\',\n',
    columns: props.properties.map(property => property.name).join(', '),
    values: props.properties.map(property => `\${${property.name}}`).join(', '),
  };
  props.properties.forEach((property) => {
    args.properties = args.properties.concat(`\n    ${property.name}: ${property.type};`);
    args.inputSchema = args.inputSchema.concat(`        ${property.name}: Joi.${property.type}()${property.required ? '.required()' : '.default()'},\n`);
    args.keys = args.keys.concat(`        '${property.name}',\n`);
  });
  return args;
}

function createModel(self, args) {
  self.fs.copyTpl(
    self.templatePath('model/index.ts'),
    self.destinationPath(`src/model/${args.modelName}/index.ts`),
    args);
}

function updateModel(args) {
  try {
    rewrite({
      file: 'src/model/index.ts',
      needle: '// import repos here',
      splicable: [
        `import { ${args.interfaceName}Repo } from './${args.modelName}';`,
      ],
    });
    rewrite({
      file: 'src/model/index.ts',
      needle: '// declare repos here',
      splicable: [
        `${args.modelName}: ${args.interfaceName}Repo;`,
      ],
    });
    rewrite({
      file: 'src/model/index.ts',
      needle: '// create repos here',
      splicable: [
        `obj.${args.modelName} = new ${args.interfaceName}Repo(obj, pgp);`,
      ],
    });
    rewrite({
      file: 'src/model/index.ts',
      needle: '// export interfaces here',
      splicable: [
        `export { ${args.interfaceName} } from './${args.modelName}';`,
      ],
    });
    console.log(`   ${chalk.yellow('update')} src/model/index.ts`);
  } catch (err) {
    console.error(`   ${chalk.red('error')} src/model/index.ts not exist`);
  }
}

function createController(self, args) {
  self.fs.copyTpl(
    self.templatePath('controller/index.ts'),
    self.destinationPath(`src/controllers/${args.modelName}/index.ts`),
    args);
  self.fs.copyTpl(
    self.templatePath('controller/index.spec.ts'),
    self.destinationPath(`src/controllers/${args.modelName}/index.spec.ts`),
    args);
  self.fs.copyTpl(
    self.templatePath('controller/validator.ts'),
    self.destinationPath(`src/controllers/${args.modelName}/validator.ts`),
    args);
}

function updateController(args) {
  try {
    rewrite({
      file: 'src/controllers/index.ts',
      needle: '// export controllers here',
      splicable: [
        `export * from './${args.modelName}';`,
      ],
    });
    console.log(`   ${chalk.yellow('update')} src/controllers/index.ts`);
  } catch (err) {
    console.error(`   ${chalk.red('error')} src/controllers/index.ts not exist`);
  }
}

function updatePolicyConfig(args) {
  try {
    rewrite({
      file: 'src/config/policies.ts',
      needle: '// add policies here',
      splicable: [
        `${args.modelName}Controller: {`,
        '    getAll: [],',
        '    getOne: [],',
        '    add: [],',
        '    remove: [],',
        '    edit: [],',
        '},',
      ],
    });
    console.log(`   ${chalk.yellow('update')} src/config/policies.ts`);
  } catch (err) {
    console.error(`   ${chalk.red('error')} src/config/policies.ts not exist`);
  }
}

function updateRouteConfig(args) {
  try {
    rewrite({
      file: 'src/config/routes.ts',
      needle: '// add routes here',
      splicable: [
        `'GET /${args.pluralName}': '${args.modelName}Controller.getAll',`,
        `'GET /${args.pluralName}/:id': '${args.modelName}Controller.getOne',`,
        `'POST /${args.pluralName}': '${args.modelName}Controller.add',`,
        `'DELETE /${args.pluralName}/:id': '${args.modelName}Controller.remove',`,
        `'PUT /${args.pluralName}/:id': '${args.modelName}Controller.edit',`,
      ],
    });
    console.log(`   ${chalk.yellow('update')} src/config/routes.ts`);
  } catch (err) {
    console.error(`   ${chalk.red('error')} src/config/routes.ts not exist`);
  }
}

function addController(self, args) {
  createController(self, args);
  updateController(args);
  updatePolicyConfig(args);
  updateRouteConfig(args);
}

module.exports = {
  prompting: self => co(function* () {
    const props = yield self.prompt([{
      type: 'input',
      name: 'basicName',
      message: 'Model name? (snake_case)',
    }, {
      type: 'confirm',
      name: 'rest',
      message: 'Create REST API?',
    }]);

    if (props.rest) {
      props.plural = (yield self.prompt({
        type: 'input',
        name: 'plural',
        message: 'Plural name? (snake_case)',
      })).plural;
    }

    props.properties = [];
    while (true) {
      const property = yield self.prompt({
        type: 'input',
        name: 'name',
        message: 'Property name? (camelCase) - leave blank for done',
      });

      if (!property.name) {
        break;
      }

      Object.assign(property, yield self.prompt([{
        type: 'input',
        name: 'type',
        message: 'Property type?',
        default: 'string',
      }, {
        type: 'confirm',
        name: 'required',
        message: 'Required?',
      }]));

      props.properties.push(property);
    }

    self.props = props;
  }),

  writing: (self) => {
    const props = self.props;
    const args = buildArgs(props);
    createModel(self, args);
    updateModel(args);
    props.rest && addController(self, args);
  },
};
