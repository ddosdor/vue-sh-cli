/*
 * =============================================================================
 * Project: VueShCli
 * Created Date: 2018-07-04, 16:12:15
 * Author: Sebastian Drzewicki <sebastian.drzewicki@gmail.com>
 * =============================================================================
 * Last Modified: 2018-07-05, 15:36:56
 * Modified By: Sebastian Drzewicki
 * =============================================================================
 * Copyright (c) 2018 Telestrada
 * =============================================================================
 */
export interface ICommand {
  availableOptions: string[],
  run(options: any): void;
}