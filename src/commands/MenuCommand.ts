import { ICommand } from './../types';
import Teminal from './../tools/Terminal';

export default class MenuCommand implements ICommand {
  availableOptions: string[] = [];

  private menu: string = `
    Usage: vsh [command] [options]

    Commands:
      menu      ........................ show CLI menu
      component ........................ create new component from template
      view      ........................ create new view from template
      module    ........................ create new Vuex module from template
      filter    ........................ create new filter from template
  `

  private printMenu(): void {
    console.log(this.menu);
  }

  public run(): void {
    Teminal.printFancyLogo();
    this.printMenu();
  }
}
