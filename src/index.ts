import { Command } from 'commander';
import addCommand from './commands/index.js';
import { onReady } from './utils/dirMs.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
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

function readPackageVersion(defult = '1.0.0') {
  try {
    const data = JSON.parse(
      readFileSync(
        resolve(fileURLToPath(import.meta.url), '../../package.json'),
        'utf-8',
      ),
    );
    if (data && data.version) return data.version;
    return defult;
  } catch {
    return defult;
  }
}
