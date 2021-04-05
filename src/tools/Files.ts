import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import terminal from './Terminal';

/**
 * Files tools
 *
 * @export
 * @class Files
 */
export default class Files {

  /**
   * Return current directory base
   *
   * @static
   * @returns {String}
   * @memberof Files
   */
  public static getCurrenntDirectoryBase(): String {
    return path.basename(process.cwd())
  }

  /**
   * Check if directory exists
   *
   * @static
   * @param {string} [directoryPath='']
   * @returns {Boolean}
   * @memberof Files
   */
  public static checkIfDirectoryExists(directoryPath: string = ''): Boolean {
    try {
      return fs.statSync(directoryPath).isDirectory();
    } catch (err) {
      return false;
    }
  }
  
  /**
   * Check if this is project main directory. Checking is done by verifying if there is a 'src' folder
   *
   * @static
   * @returns {Boolean}
   * @memberof Files
   */
  public static checkIfThisIsProjectMainDirecotry(rootSrcDirectory = 'src'): Boolean {
    const root = this.getCurrenntDirectoryBase();
    if (!this.checkIfDirectoryExists(rootSrcDirectory)) {    
      terminal.showError(`directory "${rootSrcDirectory}" does not exist\n`);
      terminal.showMessage(`Are you sure you are in the main Vue project directory?\n`);        
      return false;
    } else {
      return true;
    }    
  }

  /**
   * Create new directory. Creates also parent directory if not exists
   *
   * @static
   * @param {string} [fullPathWithDirectoryName='']
   * @returns {Promise<any>}
   * @memberof Files
   */
  public static createDirectory(fullPathWithDirectoryName: string = ''): Promise<any> {
    return mkdirp(fullPathWithDirectoryName)
      .catch(err => console.log(err)); 
  }

  public static getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (err) {
      return 0;
    }
  }

  public static deleteFile(filePath) {
    fs.unlinkSync(filePath);
  }

  public static deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = folderPath + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { 
          Files.deleteFolder(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
}
