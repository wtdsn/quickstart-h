import { Command } from 'commander';
import inquirer from 'inquirer';

import dirMs from '../utils/dirMs.js';
import NextCall, { CallBack } from '../utils/nextCall.js';
import log from '../utils/log.js';
import { isEmpty } from '../utils/index.js';

const COMMAND_NAME = 'dir';

interface DirOptions {
  list: boolean;
  get: string;
  set: `${string}:${string}`;
  delete: string[];
  rename: `${string}:${string}`;
  use: string;
}

const nextCall = new NextCall<DirOptions>([]);

// 处理函数入口
function dirActionHandler(options: DirOptions) {
  nextCall.init([
    // list
    listDirs,
    // get
    getDirByName,
    // set
    setDir,
    // delete
    delDir,
    // rename
    renameDir,
    // use
    useDir,
  ]);
  nextCall.start(options);
}

// 命令
export function addDirCommand(program: Command) {
  program
    .command(COMMAND_NAME)
    .description('dir command is used to manage dirs')
    .option('-L,--list', 'list all dirs')
    .option('-G,--get <name>', 'get dir by name')
    .option('-S,--set <name:path>', 'set dir')
    .option(
      '-D,--delete <name...>',
      'delete dir by names, if delete all,name can be .',
    )
    // 重命名
    .option('-R,--rename <oldName:newName>', 'rename dir')
    // 设置默认目录
    .option('-U,--use <name>', 'use it use default dir')
    .action(dirActionHandler);
}

type Cb = CallBack<DirOptions>;

// list
const listDirs: Cb = (options) => {
  if (!options.list) return true;

  const list = dirMs.getList();
  if (!list.length) {
    log.warn('dir is empty');
    return;
  }

  list.forEach((item) => {
    log.info(item.join('='));
  });
};

// get
const getDirByName: Cb = (options) => {
  if (!options.get) return true;

  const path = dirMs.getDir(options.get);
  if (path === undefined) {
    log.warn(`dir "${options.get}" not found`);
  } else {
    log.info(path);
  }
};

// set
const setDir: Cb = async (options) => {
  if (!options.set) return true;
  const dirItem = options.set.split(':');
  if (dirItem.length !== 2 || isEmpty(dirItem[0]) || isEmpty(dirItem[1])) {
    log.warn(
      `argument "${options.set}" is not valid, it should be like "name:path"`,
    );
    return;
  }
  const [name, dir] = dirItem;

  // todo 检测 name 和 dir 是否合法

  let preDir = dirMs.getDir(name);

  // 覆盖
  if (preDir !== undefined) {
    const { isCover } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isCover',
        message: `dir ${name} is exist, do you want to cover it?`,
        default: false,
      },
    ]);
    if (isCover) preDir = undefined;
  }

  if (preDir === undefined) {
    await dirMs
      .pushDir(name, dir)
      .then(() => {
        log.success('set dir success');
      })
      .catch(() => {
        log.warn('set dir fail');
      });
    return;
  }
};

// delet
const delDir: Cb = async (options) => {
  if (!options.delete) return true;
  const delNames = options.delete;
  if (delNames.includes('.') && delNames.length > 1) {
    log.warn(`argument should be "." or a list of name, but get "${delNames}"`);
    return;
  }

  if (delNames[0] === '.') {
    delNames.length = 0;
    delNames.push(...dirMs.getDirNames());
  }

  const { isComfirmDel } = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'isComfirmDel',
        message: `do you comfirm to delete dir(s): ${delNames.join(', ')}?`,
        default: false,
      },
    ])
    .catch(() => {
      return { isComfirmDel: false };
    });
  if (isComfirmDel === false) return;

  try {
    await dirMs.delDir(delNames);
    log.success('delete dir success');
  } catch (err: any) {
    log.warn(err?.message || 'delete dir fail');
  }
};

// rename
const renameDir: Cb = async (options) => {
  if (!options.rename) return true;
  const renameItem = options.rename.split(':');
  if (
    renameItem.length !== 2 ||
    isEmpty(renameItem[0]) ||
    isEmpty(renameItem[1])
  ) {
    log.warn(
      `argument "${options.rename}" is not valid, it should be like "oldName:newName"`,
    );
    return;
  }
  const [oldName, newName] = renameItem;

  // todo 检测 oldName 和 newName 是否合法

  try {
    await dirMs.rename(oldName, newName);
    log.success('rename dir success');
  } catch (err: any) {
    log.warn(err?.message || 'rename dir fail');
  }
};

// useDir
const useDir: Cb = async (options) => {
  if (!options.use) return true;
  const dir = dirMs.getDir(options.use);
  if (dir === undefined) {
    log.warn(`dir "${options.use}" not found`);
    return;
  }
  try {
    await dirMs.pushDir('default', dir);
    log.success(`use dir ${options.use} success!`);
    log.info(`default=${dir}`);
  } catch (err: any) {
    log.warn(err?.message || 'use dir fail');
  }
};
