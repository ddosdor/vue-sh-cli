const minimist = require('minimist');
const ora = require('ora');

const terminal = require('./tools/terminal');
const files = require('./tools/files');
const utils = require('./tools/utils');

const commands = require('./commands');

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  const cmd = args._[0]
  const options = utils.getPassedOptionsFromCmd(args);
  const spinner = ora().start();
  
  // run cli command
  commands[cmd]? commands[cmd].run(options) : terminal.showError(`no ${cmd} ddfs`);
  spinner.stop();
}