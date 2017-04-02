const rewrite = require('./util').rewrite;
const chalk = require('chalk');

module.exports = {
  prompting: (self) => {
    const prompts = [{
      type: 'input',
      name: 'responseName',
      message: 'response name?',
    }, {
      type: 'input',
      name: 'statusCode',
      message: 'status code?',
    }];

    return self.prompt(prompts).then((props) => {
      self.props = props;
    });
  },
  writing: (self) => {
    const name = self.props.responseName;
    self.fs.copyTpl(
      self.templatePath('response/index.ts'),
      self.destinationPath(`src/responses/${name}/index.ts`),
      self.props);
    //   self.fs.copyTpl(
    //       self.templatePath('response/index.spec.ts'),
    //       self.destinationPath(`src/responses/${name}/index.spec.ts`),
    //       self.props);
    rewrite({
      file: 'src/responses/index.ts',
      needle: '// import responses here',
      splicable: [
        `import { ${name} } from './${name}';`,
      ],
    });
    rewrite({
      file: 'src/responses/index.ts',
      needle: '// declare responses here',
      splicable: [
        `${name}: (data?: any) => void;`,
      ],
    });
    rewrite({
      file: 'src/responses/index.ts',
      needle: '// set response functions here',
      splicable: [
        `res.${name} = ${name};`,
      ],
    });
    console.log(`   ${chalk.yellow('update')} src/responses/index.ts`);
  },
};
