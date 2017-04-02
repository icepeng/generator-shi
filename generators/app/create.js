module.exports = {
  prompting: (self) => {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Project name?',
      default: self.appname,
    }, {
      type: 'input',
      name: 'dbHost',
      message: 'Database host?',
      default: 'localhost',
    }, {
      type: 'input',
      name: 'dbPort',
      message: 'Database port?',
      default: '5432',
    }, {
      type: 'input',
      name: 'dbName',
      message: 'Database name?',
      default: self.appname,
    }, {
      type: 'input',
      name: 'dbUser',
      message: 'Database user name?',
      default: 'pinkbean',
    }];

    return self.prompt(prompts).then((props) => {
      self.props = props;
    });
  },
  writing: (self) => {
    self.fs.copyTpl(
          self.templatePath('src'),
          self.destinationPath('src'),
          self.props);
    self.fs.copy(
          self.templatePath('test'),
          self.destinationPath('test'));
    self.fs.copy(
          self.templatePath('.gitignore.template'),
          self.destinationPath('.gitignore'));
    self.fs.copy(
          self.templatePath('gulpfile.js'),
          self.destinationPath('gulpfile.js'));
    self.fs.copy(
          self.templatePath('.editorconfig'),
          self.destinationPath('.editorconfig'));
    self.fs.copy(
          self.templatePath('tsconfig.json'),
          self.destinationPath('tsconfig.json'));
    self.fs.copy(
          self.templatePath('tslint.json'),
          self.destinationPath('tslint.json'));
    self.fs.copyTpl(
          self.templatePath('package.json'),
          self.destinationPath('package.json'),
          self.props);
    self.fs.copy(
          self.templatePath('yarn.lock'),
          self.destinationPath('yarn.lock'));
  },
};
