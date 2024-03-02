import chalk from 'chalk';

// 输出信息
export function info(text: string) {
  console.log(chalk.blue(text));
}

// 警告 , 提示
export function warn(text: string) {
  console.log(chalk.yellow(text));
}

// 操作结果
export function success(text: string) {
  console.log(chalk.green(text));
}

// 错误
export function error(text: string) {
  console.log(chalk.red(text));
}

export default {
  info,
  warn,
  success,
  error,
};
