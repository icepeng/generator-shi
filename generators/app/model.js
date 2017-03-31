const rewrite = require('./util').rewrite;
const co = require('co');
const chalk = require('chalk');

function snakeToCamel(s) {
  return s.replace(/(_\w)/g, m => m[1].toUpperCase());
}

function kebabToCamel(s) {
  return s.replace(/(-\w)/g, m => m[1].toUpperCase());
}

function toCapital(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = {
  prompting: (self) => {
    return co(function* () {
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
    });
  },
  writing: (self) => {
    const props = self.props;
    const args = {
      tableName: props.basicName,
      modelName: snakeToCamel(props.basicName),
      interfaceName: toCapital(snakeToCamel(props.basicName)),
      properties: 'id?: string;\n    create_time?: Date;',
      inputSchema: '',
      keys: `'id',\n        'create_time',\n`,
    };
    args.columns = props.properties.map(property => property.name).join(', ');
    args.values = props.properties.map(property => `\${${property.name}}`).join(', ');
    props.properties.forEach((property) => {
      args.properties = args.properties.concat(`\n    ${property.name}: ${property.type};`);
      args.inputSchema = args.inputSchema.concat(`        ${property.name}: Joi.${property.type}()${property.required ? '.required()' : '.default()'},\n`);
      args.keys = args.keys.concat(`        '${property.name}',\n`);
    });

    self.fs.copyTpl(
      self.templatePath('model/index.ts'),
      self.destinationPath(`src/model/${args.modelName}/index.ts`),
      args);
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

    if (props.rest) {
      args.pluralName = snakeToCamel(props.plural);
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

      try {
        rewrite({
          file: 'src/config/policies.ts',
          needle: '// add policies here',
          splicable: [
            `${args.modelName}Controller: {
        getAll: [],
        getOne: [],
        add: [],
        remove: [],
        edit: [],
      },`,
          ],
        });
        console.log(`   ${chalk.yellow('update')} src/config/policies.ts`);
      } catch (err) {
        console.error(`   ${chalk.red('error')} src/config/policies.ts not exist`);
      }

      try {
        rewrite({
          file: 'src/config/routes.ts',
          needle: '// add routes here',
          splicable: [
            `'GET /${args.pluralName}': '${args.modelName}Controller.getAll',
      'GET /${args.pluralName}/:id': '${args.modelName}Controller.getOne',
      'POST /${args.pluralName}': '${args.modelName}Controller.add',
      'DELETE /${args.pluralName}/:id': '${args.modelName}Controller.remove',
      'PUT /${args.pluralName}/:id': '${args.modelName}Controller.edit',`,
          ],
        });
        console.log(`   ${chalk.yellow('update')} src/config/routes.ts`);
      } catch (err) {
        console.error(`   ${chalk.red('error')} src/config/routes.ts not exist`);
      }
    }
  },
}