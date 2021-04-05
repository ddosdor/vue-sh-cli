import { ICommand } from './../types';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import Config from './../config';
import Files from './../tools/Files';
import Utils from './../tools/Utils';
import Terminal from './../tools/Terminal';

interface IComponentOptions {
  name: string,
  single: string,
  parent: string,
  functional: string,
  test: string,
  help: string
}

/**
 * Class that implemenets 'component' cli command
 *
 * @export
 * @class ComponentCommand
 * @implements {ICommand}
 */
export default class ComponentCommand implements ICommand {
  availableOptions: string[] | any = ['name', 'single', 'parent', 'functional', 'test', 'help', 'version'];
  testDirectory: string = '__tests__';
  mainDirectory: string = 'components';
  rootSrcDirectory: string = 'src';
  alwaysCreateSpecFiles: boolean = false;
  defaultComponentStyle: string = 'separate';

  private async readConfig(): Promise<void> {
    const __config__ = await Config;
    this.mainDirectory = __config__.directories.components || this.mainDirectory;
    this.testDirectory = __config__.directories.unitTests || this.testDirectory
    this.rootSrcDirectory = __config__.settings.rootSrcDirectory || this.rootSrcDirectory;
    this.alwaysCreateSpecFiles = __config__.settings.alwaysCreateSpecFiles || this.alwaysCreateSpecFiles;
    this.defaultComponentStyle = __config__.settings.defaultComponentStyle || this.defaultComponentStyle;    
  }

  private showHelpMessage(): void {
    const helpMessage = `\n
      Command for creating a new component.

      Usage: vsh component [options]

      Available options:
        - name (*required)      ....... name of the new component
        - single (optional)     ....... create component as a single *.vue file
        - functional (optional) ....... new component is created as a functional component
        - parent (optional)     ....... creates a new component in the folder provided in the option
        - test (optional)       ....... generate unit test for component

      Example:
        * Create component with 'MyAwesomeComponent' name as a separate files (*.sass, *.js, *.vue)
        in 'src/components/MyAwesomeComponent' directory:

        $: vsh component --name MyAwesomeComponent --functional
    

        * Create component with 'MyAwesomeFunctionalSingleComponent' as a single file component
        in 'src/components/CommonComponents/' directory:

        $: vsh component --name MyAwesomeFunctionalSingleComponent --functional --single --parent CommonComponents
        \n
    `;

    Terminal.showMessage(helpMessage);
  }

  /**
   * Create new component as single file
   *
   * @private
   * @param {IComponentOptions} options
   * @returns {Promise<void>}
   * @memberof ComponentCommand
   */
  private async createSingleFileComponent(options: IComponentOptions): Promise<void> {
    try {
      const parentDirectory = options.parent? `/${options.parent}` : '';
      await Files.createDirectory(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}`);
      const componentName = options.name;
      const componentFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/SingleFileComponent.vue.ejs'), options);

      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}.vue`, componentFile);
      Terminal.showMessage(`Success! Component '${componentName}' has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`);
    }    
  }

  /**
   * Create new component as multiple files
   *
   * @private
   * @param {IComponentOptions} options
   * @returns {Promise<void>}
   * @memberof ComponentCommand
   */
  private async createSeparateFilesComponent(options: IComponentOptions): Promise<void> {
    try {
      const componentName = options.name;
      const parentDirectory = options.parent? `/${options.parent}` : '';
      await Files.createDirectory(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}`);
      const componentScriptFile = options.functional? null : await ejs.renderFile(path.resolve(__dirname + '/../../templates/Component.component.js.ejs'), options);
      const componentTemplateFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Component.index.vue.ejs'), options);
      const componentStyletFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Component.style.sass.ejs'), options);

      options.functional || fs.writeFileSync(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}/component.js`, componentScriptFile);
      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}/index.vue`, componentTemplateFile);
      fs.writeFileSync(`./${this.rootSrcDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}/style.sass`, componentStyletFile);

      Terminal.showMessage(`Success! Component '${componentName}' has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`);
    }
  }

  /**
   * Create unit test for component
   *
   * @private
   * @param {*} options
   * @returns {Promise<void>}
   * @memberof ComponentCommand
   */
  private async createUnitTest(options: IComponentOptions): Promise<void> {
    try {
      const componentName = options.name;
      const parentDirectory = options.parent? `/${options.parent}` : '';
      await Files.createDirectory(`./${this.testDirectory}/${this.mainDirectory}${parentDirectory}`);

      const componentTestFile = await ejs.renderFile(path.resolve(__dirname + '/../../templates/Component.spec.js.ejs'), options);
      fs.writeFileSync(`./${this.testDirectory}/${this.mainDirectory}${parentDirectory}/${componentName}.spec.js`, componentTestFile);

      Terminal.showMessage(`Success! Unit tests for component '${componentName}' has been created!\n`);
    } catch (err) {
      Terminal.showError(`\n ${err}`);      
    }
  }

  /**
   * Run command
   *
   * @param {IComponentOptions} options
   * @returns {void}
   * @memberof ComponentCommand
   */
  public async run(options: IComponentOptions): Promise<void> {
    await this.readConfig();

    if (options.help) {
      this.showHelpMessage() 
      return;
    }

    if (!Files.checkIfThisIsProjectMainDirecotry(this.rootSrcDirectory)) return;
    if (!Utils.validatePassedOptions(options, this.availableOptions)) return;

    (this.defaultComponentStyle === 'sfc' || options.single)? this.createSingleFileComponent(options) : this.createSeparateFilesComponent(options);
    (this.alwaysCreateSpecFiles || options.test) && this.createUnitTest(options);
  }
}
