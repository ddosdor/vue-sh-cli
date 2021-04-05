import { ICommand } from './../types';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import Terminal from './../tools/Terminal';

/**
 * Class that implements init command
 *
 * @export
 * @class InitCommand
 */
interface IViewOptions {
  help: string
}

export default class InitCommand implements ICommand {
  availableOptions: string[] | any = ['name', 'parent', 'test', 'help', 'version', 'lang'];

  private showHelpMessage(): void {
    const helpMessage = `\n
      Command for create config file for VueShCli tool with main Vue project folder.

      Usage: vsh init
      \n
    `;

    Terminal.showMessage(helpMessage);
  }

  private async createInitFile(): Promise<void> {
    try {
      const configFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/vshclirc.ejs'), {});
      Terminal.showMessage(`Success! Config file has been created!\n`);

      fs.writeFileSync(`./.vshclirc.json`, configFile);
    } catch (err) {
      Terminal.showError(`\n ${err}`);
    }
  }

  public run(options: IViewOptions): void {
    if (options.help) {
      this.showHelpMessage();
      return;
    }

    this.createInitFile();
  }  
}