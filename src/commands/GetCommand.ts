import { ICommand } from './../types';
import * as util from 'util';
import * as tar from 'tar';
import * as ncp from 'ncp';
import Config from './../config';
import Files from './../tools/Files';
import Utils from './../tools/Utils';
import Terminal from './../tools/Terminal';

interface IGetOptions {
  source: string,
  name: string,
  parent: string,
  help: string,
}

export default class GetCommand implements ICommand {
  availableOptions: string[] | any = ['source', 'name', 'parent', 'help', 'lang', 'version'];
  rootSrcDirectory: string = 'src';
  sources: object = {};

  private async readConfig(): Promise<void> {
    const __config__ = await Config;
    this.rootSrcDirectory = __config__.settings.rootSrcDirectory || this.rootSrcDirectory;
    this.sources = __config__.sources || {};
  }

  private showHelpMessage(): void {
    const helpMessage = `\n
      Command for downloading an element from external source.
      This command requires to add the appropriate settings in the file: .vshclirc.json.
      Details in the documentation: https://github.com/ddosdor/vue-sh-cli/blob/master/README.md

      Usage: vsh get [options]

      Available options:
        - source (*required)   ....... repo source defined in settings file
        - name (*required)     ....... name of element from repo
        - parent (optional)    ....... downloading a new element in the folder provided in the option
        
      Example:
      * Download component 'MyAwesomeComponent' from source 'components' defined in .vshclirs.json

      $: vsh get --source components --name MyAwesomeComponent

      * Download component 'DividerLine' from source 'helpers' defined in .vshclirs.json to 'Helpers' directory

      $: vsh get --source helpers --name DividerLine --parent Helpers     
      \n
    `;

    Terminal.showMessage(helpMessage);
  }

  private validateSources(options): boolean {
    const { source } = options;

    if (Object.keys(this.sources).length === 0) {
      Terminal.showError('\n You have not defined any sources');          
      return false;
    }

    if (this.sources[source] === undefined) {
      Terminal.showError(`\n Source '${source}' is not defined`);           
      return false;
    }

    if (this.sources[source].remote === undefined) {
      Terminal.showError(`\n Key 'remote 'in source '${source}' is not defined`);           
      return false;      
    }

    if (this.sources[source].path === undefined) {
      Terminal.showError(`\n Key 'path 'in source '${source}' is not defined`);           
      return false;      
    }
    
    if (this.sources[source].dest === undefined) {
      Terminal.showError(`\n Key 'dest 'in source '${source}' is not defined`);           
      return false;      
    }    

    return true;
  } 

  private async downloadElementFromRepo(options): Promise<void> {
    try {
      const exec = util.promisify(require('child_process').exec);
      const { source, name, parent } = options;
      const parentDirectory = options.parent? `/${options.parent}` : '';
      const params = this.sources[source];
      const command = `git archive --remote=${params.remote} HEAD ${params.path}/${name} > ${this.rootSrcDirectory}/${params.dest}/${parentDirectory}${name}.tar`;

      Terminal.showMessage(`\n --> Download ${name} from ${params.remote}`);

      await Files.createDirectory(`./${this.rootSrcDirectory}/${params.dest}/${parentDirectory}`);
      const { stdout } = await exec(command);
    } catch (err) {
      Terminal.showError(`\n ${err}`); 
    }
  }

  private async unpackTarrbalFile(options) {
    try {
      const { source, name, parent } = options;
      const parentDirectory = options.parent? `/${options.parent}` : '';
      const params = this.sources[source];
      const elementTarballFile = `${this.rootSrcDirectory}/${params.dest}/${parentDirectory}${name}.tar`;
      const destinationDirectory = `${this.rootSrcDirectory}/${params.dest}/${parentDirectory}`;

      if (Files.getFileSize(elementTarballFile) > 0) {
        Terminal.showMessage(`\n --> Extract ${name}.tar`);

        await tar.extract({
          cwd: destinationDirectory,
          file: elementTarballFile
        });

        Terminal.showMessage(`\n --> Copy all files . . .`);
        ncp(`${destinationDirectory}/${params.path}`, destinationDirectory, () => {
          Files.deleteFolder(`${destinationDirectory}/${params.path.split(/[/\\]+/)[0]}`)
          Terminal.showMessage(`\n --> Done! \n`);

          Terminal.showMessage(`Success! Component '${name}' has been donwloaded!\n`);
        });
      };

      Terminal.showMessage(`\n --> Delete ${name}.tar`);
      Files.deleteFile(elementTarballFile);
    } catch (err) {
      Terminal.showError(`\n ${err}`);
    }
  }

  /**
   * Run command
   *
   * @param {IGetOptions} options
   * @returns {void}
   * @memberof GetCommand
   */
  public async run(options: IGetOptions): Promise<void> {
    await this.readConfig();

    if (options.help) {
      this.showHelpMessage() 
      return;
    }

    if (!Files.checkIfThisIsProjectMainDirecotry(this.rootSrcDirectory)) return;
    if (!Utils.validatePassedOptions(options, this.availableOptions)) return;
    if (!this.validateSources(options)) return;
    
    await this.downloadElementFromRepo(options);
    await this.unpackTarrbalFile(options);
  }
}