const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const create = require('./create');
const response = require('./response');
const policy = require('./policy');
const model = require('./model');

const generators = {
  new: create,
  response,
  policy,
  model,
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('target', {
      type: String,
      required: false,
      default: 'new',
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the slick ${chalk.red('YOSHI')} generator!`,
    ));

    return generators[this.options.target].prompting(this);
  }

  writing() {
    generators[this.options.target].writing(this);
  }

  install() {
    if (this.options.target === 'new') {
      this.yarnInstall();
    }
  }
};
