const rewrite = require('./util').rewrite;

module.exports = {
  prompting: (self) => {
    const prompts = [{
        type: 'input',
        name: 'policyName',
        message: 'Policy name?',
    }];

    return self.prompt(prompts).then((props) => {
        self.props = props;
    });
  },
  writing: (self) => {
      self.fs.copyTpl(
          self.templatePath('policy/index.ts'),
          self.destinationPath(`src/policies/${self.props.policyName}/index.ts`),
          self.props);
      self.fs.copyTpl(
          self.templatePath('policy/index.spec.ts'),
          self.destinationPath(`src/policies/${self.props.policyName}/index.spec.ts`),
          self.props);
      rewrite({
          file: 'src/policies/index.ts',
          needle: '// export policies here',
          splicable: [
              `export * from './${self.props.policyName}'`,
          ],
      });
      console.log(`   ${chalk.yellow('update')} src/policies/index.ts`);
  },
}