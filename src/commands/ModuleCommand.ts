import { ICommand } from './../types';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import Config from './../config';
import Files from './../tools/Files';
import Utils from './../tools/Utils';
import Terminal from './../tools/Terminal';

interface IModuleOptions {
  name: string,
  help: string
}

/**
 * Class that implements module cli command
 *
 * @export
 * @class ModuleCommand
 * @implements {ICommand}
 */
export default class ModuleCommand implements ICommand {
  availableOptions: string[] | any = ['name', 'help'];
  vuexDirectory: string = 'vuex';
  mainDirectory: string = 'modules';
  rootSrcDirectory: string = 'src';

  private async readConfig(): Promise<void> {
    const __config__ = await Config;
    this.vuexDirectory = __config__.directories.vuex || this.vuexDirectory;
    this.mainDirectory = __config__.directories.modules || this.mainDirectory;
    this.rootSrcDirectory = __config__.settings.rootSrcDirectory || this.rootSrcDirectory;  
  }  

  private showHelpMessage(): void {
    const helpMessage = `
    Command for creating a new Vuex module.

    Usage: vsh component [options]

    Available options:
      - name (*required)      ....... name of the new module

    Example:
      * Create Vuex module with 'MyModule' name

      $: vsh module --name MyModule
      \n    
    `;

    Terminal.showMessage(helpMessage);
  }

  /**
   * Create new Vuex modue file
   *
   * @private
   * @param {IModuleOptions} options
   * @returns {Promise<void>}
   * @memberof ModuleCommand
   */
  private async createModule(options: IModuleOptions): Promise<void> {
    try {
      const moduleName = options.name;
      await Files.createDirectory(`./${this.rootSrcDirectory}/${this.vuexDirectory}/${this.mainDirectory}/${moduleName}`);
      const moduleMainFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Module.index.js.ejs'), options);
      const moduleActionsFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Module.actions.js.ejs'), options);
      const moduleMutationsFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Module.mutations.js.ejs'), options);
      const moduleMutationsTypessFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Module.mutations-types.js.ejs'), options);

      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.vuexDirectory}/${this.mainDirectory}/${moduleName}/index.js`, moduleMainFile);
      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.vuexDirectory}/${this.mainDirectory}/${moduleName}/actions.js`, moduleActionsFile);
      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.vuexDirectory}/${this.mainDirectory}/${moduleName}/mutations.js`, moduleMutationsFile);
      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.vuexDirectory}/${this.mainDirectory}/${moduleName}/mutations-types.js`, moduleMutationsTypessFile);

      Terminal.showMessage(`Success! Vuex '${moduleName}' module has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`);
    }
  }

  /**
   * Run command
   *
   * @param {IModuleOptions} options
   * @returns {void}
   * @memberof ModuleCommand
   */
  public async run(options: IModuleOptions): Promise<void> {
    await this.readConfig();

    if (options.help) {
      this.showHelpMessage();
      return;
    }

    if (!Files.checkIfThisIsProjectMainDirecotry(this.rootSrcDirectory)) return;
    if (!Utils.validatePassedOptions(options, this.availableOptions)) return;
    
    this.createModule(options);
  }
}