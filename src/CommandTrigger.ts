import Config from './config';
import Utils from './tools/Utils';
import Terminal from './tools/Terminal';
import MenuCommand from './commands/MenuCommand';
import ComponentCommand from './commands/ComponentCommand';
import ViewCommand from './commands/ViewCommand';
import ModuleCommand from './commands/ModuleCommand';
import GetCommand from './commands/GetCommand';
import InitCommand from './commands/InitCommand';

export default class CommandTrigger {
  static aliases: any = [];

  static async readConfig(): Promise<void> {
    const __config__ = await Config;
    this.aliases = __config__.aliases || this.aliases;
  }

  static possibleCommands: Object = {
    menu: new MenuCommand(),
    component: new ComponentCommand(),
    view: new ViewCommand(),
    module: new ModuleCommand(),
    get: new GetCommand(),
    init: new InitCommand(),
  }

  public static getPassedOptions(options) {
    const _passedOptions_ = Object.keys(options);
    const _options_ = {};
    _passedOptions_.forEach(option => {
       _options_[Utils.getObjectKeyByValue(this.aliases.options, option) || option] = options[option];
    });
    return _options_;
  }

  public static async run(command: string = '', options: object = {}): Promise<void> {
    await this.readConfig();

    try {
      const _command_ = Utils.getObjectKeyByValue(this.aliases.commands, command) || command;
      // let the magic begin
      this.possibleCommands[_command_].run(this.getPassedOptions(options))
    } catch(err) {
      Terminal.showError(`\n There is no such command or alias as: "${command}"`);
    }
  }
}
