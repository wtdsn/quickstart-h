import { Command } from 'commander';
import { addDirCommand } from './commands/dir';
import { onReady } from './utils/dirMs';
const program = new Command();
program
  .name('qs')
  .description('CLI for quickly starting code')
  .version('1.0.0')
  .usage('[command] [options] [args...]');

addDirCommand(program);

onReady(() => {
  program.parse(process.argv);
});
