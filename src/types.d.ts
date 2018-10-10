
export interface ICommand {
  availableOptions: string[],
  run(options: any): void;
}