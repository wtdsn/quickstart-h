import { Command } from 'commander';
import inquirer from 'inquirer';
import execa from 'execa';
import ora from 'ora';
import path from 'path';
import fs from 'fs';

import dirMs from '../utils/dirMs';
import NextCall, { CallBack } from '../utils/nextCall';
import log from '../utils/log';
import { isEmpty } from '../utils';

const COMMAND_NAME = 'pro';

interface ProOptions {
  list: boolean;
  in: string;
  open: string | boolean;
  create: string;
  clone: string;
}

function proActionHandler(options: ProOptions) {
  nextCall.init([
    // list
    listPro,
    // create
    createPro,
    // colne
    clonePro,
    // open
    openPro, // 在 create 和 clone 后 ， create 和 clone 可设置自动打开，而 open 只是打开
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
    .option('-O, --open [projectName]', 'open the project in vscode')
    .option(
      '-C, --create <projectName>',
      'create a new project,add -O to auto open it after created',
    )
    .option(
      '--clone <giturl>',
      'clone a project from github,add -O to auto open it after cloned',
    )
    .action(proActionHandler);
}

type Cb = CallBack<ProOptions>;

function checkDir(dirN: string): string {
  const prosDir = dirMs.getDir(dirN);
  if (isEmpty(prosDir)) {
    log.warn(`dir ${dirN} is not exist`);
    process.exit(0);
  }
  return prosDir!;
}

function getPros(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch (err) {
    log.error(`read dir ${dir} error`);
    console.error(err);
    process.exit(-1);
  }
}

const listPro: Cb = async (options) => {
  if (!options.list) return true;
  const prosDir = checkDir(options.in);
  // 读取目录列表
  const pros = getPros(prosDir);
  if (isEmpty(pros)) {
    log.warn(`not project in ${options.in}`);
    return;
  }

  log.success(`List project in ${options.in} successfully`);
  pros.forEach((proN) => {
    log.info(`> ${proN}`);
  });
};

const createPro: Cb = async (options) => {
  if (!options.create) return true;
  const prosDir = checkDir(options.in);

  const newProN = options.create;
  const pros = getPros(prosDir);

  const exit = pros.includes(newProN);
  if (exit) {
    log.warn(`project ${newProN} already exist in (${prosDir})`);
    return;
  }
  const proPath = path.join(prosDir, newProN);
  try {
    await execa('mkdir', [proPath]);
    log.success(`create ${newProN} successful in ${prosDir}`);
    if (typeof options.open === 'boolean') {
      openVscode(proPath);
    }
  } catch (err) {
    log.error(`create ${newProN} fail in ${prosDir}`);
    throw err;
  }
};

const clonePro: Cb = async (options) => {
  if (!options.clone) return true;
  const prosDir = checkDir(options.in);
  const giturl = options.clone;

  if (!/^(https?:\/\/|git@)(.+)(\.git)?$/i.test(giturl)) {
    log.warn(`git url ${giturl} is not valid`);
    return;
  }

  const proN = giturl.split('/').pop()!.split('.')[0];
  const pros = getPros(prosDir);
  const exit = pros.includes(proN);
  if (exit) {
    log.warn(
      `clone ${giturl} fail , cause project ${proN} already exist in (${prosDir})`,
    );
    return;
  }
  const proPath = path.resolve(prosDir, proN);
  try {
    const spinner = ora('Cloning');
    spinner.color = 'green';
    spinner.start();
    await execa('git', ['clone', giturl, proPath]);
    spinner.stop();
    log.success(`clone ${giturl} into ${proPath} successful`);
    if (typeof options.open === 'boolean') {
      openVscode(proPath);
    }
  } catch (err) {
    log.error(`clone ${giturl} into ${proPath} failed`);
    throw err;
  }
};

const openPro: Cb = async (options) => {
  if (!options.open) return true;
  // 1. 获取项目所在目录
  const prosDir = checkDir(options.in);

  // 2. 获取目录下的所有目录
  const pros = getPros(prosDir);

  // 3. 判空
  if (isEmpty(pros)) {
    log.warn(`not project in ${options.in}`);
    return;
  }

  let proN;

  if (typeof options.open === 'string') {
    // 4. 如果指定项目名
    proN = pros.find((n) => n === options.open);
    if (isEmpty(proN)) {
      log.warn(`project ${options.open} not found in ${options.in}`);
      return;
    }
  } else {
    // 5. 没有指定项目名，则询问用户
    const res = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'proN',
        message: 'select the project which you want to open',
        loop: true,
        choices: pros,
        pageSize: 20,
      },
    ]);
    proN = res.proN;
  }

  const fullDir = path.join(prosDir!, proN!);
  await openVscode(fullDir);
};

async function openVscode(path: string) {
  // 暂时不考虑系统兼容问题
  try {
    await execa('open', ['-a', 'Visual Studio Code', path], {
      stdio: 'inherit',
    });
    log.success(`Open project ${path} successfuly`);
  } catch (err) {
    log.error('can not open Visual Studio Code! path:' + path);
    throw err;
  }
}
