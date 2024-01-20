import chalk from 'chalk';

export function info(text: string) {
  console.log(chalk.blue(text));
}

export function warn(text: string) {
  console.log(chalk.yellow(text));
}

export function success(text: string) {
  console.log(chalk.green(text));
}

export default {
  info,
  warn,
  success,
};
