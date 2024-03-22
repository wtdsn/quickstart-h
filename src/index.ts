import { Command } from 'commander';
import addCommand from './commands';
import { onReady } from './utils/dirMs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
const program = new Command();

program
  .name('qs')
  .description('CLI for quickly starting code')
  .version(readPackageVersion())
  .usage('[command] [options] [args...]');

addCommand(program);

onReady(() => {
  program.parse(process.argv);
});

function readPackageVersion(defult = '1.0.2') {
  try {
    const data = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
    );
    if (data && data.version) return data.version;
    return defult;
  } catch {
    return defult;
  }
}
