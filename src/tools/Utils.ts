import Terminal from './Terminal';

export default class Utils {
  static getPassedOptionsFromCmd(argv: Object | any = {}): Object {
    const options = {...argv};
    delete options._;
    return options;
  }

  static validatePassedOptions(options: object = {}, availableOptions: string[] | any = {}): boolean {
    const _options = Object.keys(options);
    for (let option of _options) {
      if (!availableOptions.includes(option)) {
        Terminal.showError(`There is no '${option}' option. \n`);
        Terminal.showMessage(`Available options for this command are:`);
        Terminal.showMessage(`\n-- ${availableOptions.slice().join('\n-- ')}`)
        Terminal.showMessage(`\nType "vsh [command] --help" for more info\n`);
        return false;
      }
    }
    return true;       
  }

  static getObjectKeyByValue(object, value): string {
    return Object.keys(object).find(key => object[key] === value);
  }
}