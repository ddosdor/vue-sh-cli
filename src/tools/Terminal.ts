import chalk from 'chalk';
import * as figlet from 'figlet';

/**
 * Terminal tools
 *
 * @export
 * @class Terminal
 */
export default class Terminal {
  /**
   * Print super fancy logo of VueShCli
   *
   * @static
   * @memberof Terminal
   */
  static printFancyLogo(): void {
    console.log(
      chalk.greenBright(
        figlet.textSync('Vue - Sh CLI', { horizontalLayout: 'full' })
      )
    );
  }

  /**
   * Print regular message
   *
   * @static
   * @param {string} [message='']
   * @memberof Terminal
   */
  static showMessage(message: string = ''): void {
    console.log(
      chalk.greenBright(message)
    )    
  }

  /**
   * Print error message
   *
   * @static
   * @param {string} [errorMessage='']
   * @memberof Terminal
   */
  static showError(errorMessage: string = ''): void {
    console.log(
      chalk.redBright(`ERROR: ${errorMessage}`)
    )    
  }
}