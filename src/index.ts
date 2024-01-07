import { Command } from 'commander';

const program = new Command();
program
  .version('1.0.0')
  .arguments('<command>')
  .action((command) => {
    console.log(`User input command: ${command}`);
  });

program.parse(process.argv);