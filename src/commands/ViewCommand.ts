import { ICommand } from './../types';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import Config from './../config';
import Files from './../tools/Files';
import Utils from './../tools/Utils';
import Terminal from './../tools/Terminal';

interface IViewOptions {
  name: string,
  parent: string,
  test: string,
  help: string
}

/**
 * Class that implement 'view' cli command
 *
 * @export
 * @class ViewCommand
 * @implements {ICommand}
 */
export default class ViewCommand implements ICommand {
  availableOptions: string[] | any = ['name', 'parent', 'test', 'help', 'version', 'lang'];
  testDirectory: string = '__tests__';
  mainDirectory: string = 'views';
  rootSrcDirectory: string = 'src';
  alwaysCreateSpecFiles: boolean = false;

  private async readConfig(): Promise<void> {
    const __config__ = await Config;
    this.mainDirectory = __config__.directories.views || this.mainDirectory;
    this.testDirectory = __config__.directories.unitTests || this.testDirectory
    this.rootSrcDirectory = __config__.settings.rootSrcDirectory || this.rootSrcDirectory;
    this.alwaysCreateSpecFiles = __config__.settings.alwaysCreateSpecFiles || this.alwaysCreateSpecFiles;
  }

  private showHelpMessage(): void {
    const helpMessage = `\n
      Command for creating a new view.

      Usage: vsh view [options]

      Available options:
        - name (*required)      ....... name of the new component
        - parent (optional)     ....... creates a new component in the folder provided in the option
        - test (optional)       ....... create unit test for view
        - lang (optional)       ....... language for vue ('ts' for typescript, default is javascript)
        - version (optional)    ....... vue version (possible value is 3 or 2, default is 2)  

      Example:
        * Create view with 'MyNewView' name in 'src/views/MyNewView' directory:

        $: vsh view --name MyNewView
    

        * Create view with 'MyNewView' as a single file component in 'src/views/UserProfile/' directory:

        $: vsh view --name MyNewView --parent UserProfile
        \n
    `;
    
    Terminal.showMessage(helpMessage);    
  }

  /**
   * Create new view file
   *
   * @private
   * @param {IViewOptions} options
   * @returns {Promise<void>}
   * @memberof ViewCommand
   */
  private async createView(options: IViewOptions): Promise<void> {
    try {
      const parentDirectory = options.parent? `/${options.parent}` : '';
      await Files.createDirectory(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}`);
      const viewName = options.name;
      const viewFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/View.vue.ejs'), options);

      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${viewName}.vue`, viewFile);
      Terminal.showMessage(`Success! View '${viewName}' has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`); 
    }
  }

  /**
   * Create unit test for view
   *
   * @private
   * @param {IViewOptions} options
   * @returns {Promise<void>}
   * @memberof ViewCommand
   */
  private async createUnitTest(options: IViewOptions): Promise<void> {
    try {
      const viewName = options.name;
      await Files.createDirectory(`./${this.testDirectory}/${this.mainDirectory}/`);

      const viewTestFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/View.spec.js.ejs'), options);
      fs.writeFileSync(`./${this.testDirectory}/${this.mainDirectory}/${viewName}.spec.js`, viewTestFile);

      Terminal.showMessage(`Success! Unit tests for view '${viewName}' has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`);   
    }
  }

  /**
   * Run command
   *
   * @param {IViewOptions} options
   * @returns {void}
   * @memberof ViewCommand
   */
  public async run(options: IViewOptions): Promise<void> {
    await this.readConfig();

    if (options.help) {
      this.showHelpMessage();
      return;
    }

    if (!Files.checkIfThisIsProjectMainDirecotry(this.rootSrcDirectory)) return;
    if (!Utils.validatePassedOptions(options, this.availableOptions)) return;

    this.createView(options);
    (this.alwaysCreateSpecFiles || options.test) && this.createUnitTest(options);
  }
}