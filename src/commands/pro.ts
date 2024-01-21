import { Command } from 'commander';
import inquirer from 'inquirer';
import globby from 'globby';

import dirMs from '../utils/dirMs';
import NextCall, { CallBack } from '../utils/nextCall';
import log from '../utils/log';
import { isEmpty } from '../utils';

const COMMAND_NAME = 'pro';

interface ProOptions {
  list: boolean;
  in: string;
  open: string;
}

function proActionHandler(options: ProOptions) {
  nextCall.init([
    // list
    listPro,
  ]);
  nextCall.start(options);
}

const nextCall = new NextCall<ProOptions>([]);
export function addProCommand(program: Command) {
  program
    .command(COMMAND_NAME)
    .option(
      '-I, --in <dirName>',
      'the projects directory, if not set,it use default dir',
      'default',
    )
    .option('-L,--list', 'list all the project')
    .action(proActionHandler);
}

type Cb = CallBack<ProOptions>;

const listPro: Cb = async (options) => {
  if (!options.list) return true;
  console.log(options);
  const proDir = dirMs.getDir(options.in);
  if (isEmpty(proDir)) {
    log.warn(`dir ${options.in} is not exist`);
    return false;
  }

  // 读取目录列表
  const paths = await globby(proDir as string);
  console.log(paths);
};
