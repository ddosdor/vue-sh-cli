import * as minimist from 'minimist';

import Terminal from './tools/Terminal';
import Utils from './tools/Utils';
import CommandTrigger from './CommandTrigger';

export default (command) => {
  const args = minimist(command);
  const cmd = args._[0]
  const options = Utils.getPassedOptionsFromCmd(args);

  // run cli command
  try {
    CommandTrigger.run(cmd, options);
  } catch (err) {
    Terminal.showError(`Ups! Command ${cmd} is not available or something went wrong\n`);
    Terminal.showError(err);
  }
}