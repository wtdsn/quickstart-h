import { Command } from 'commander';
import dirMs from '../utils/dirMs';
import chalk from 'chalk';

const COMMAND_NAME = 'dir';

export function addDirCommand(program: Command) {
  program
    .command(COMMAND_NAME)
    .description('dir command is used to manage dirs')
    .option('-L,--list', 'list all dirs')
    .action(dirActionHandler);
}

interface DirOptions {
  list: boolean;
}

function dirActionHandler(options: DirOptions) {
  if (options.list) {
    const list = dirMs.getList();
    list.forEach((item) => {
      console.log(chalk.blue(item.join('=')));
    });
    return;
  }
}
