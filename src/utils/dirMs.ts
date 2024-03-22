import { resolve } from 'path';
import os from 'os';
import { readFile, writeFile } from 'fs';
import { ensureFile } from 'fs-extra';

type DirName = string;
type DirPath = string;

type DirListItem = [DirName, DirPath];

let readyPromise: Promise<unknown>;
const DIR_CONF_PATH = resolve(os.homedir(), '.qsDirConf');
class DirMs {
  public dirList: DirListItem[] = [];
  constructor() {
    this._init();
  }

  async _init() {
    readyPromise = readConf().then((conf) => {
      this.dirList = conf;
    });
  }

  async _saveConf() {
    const saveRes = await saveConf(this.dirList);
    if (!saveRes) throw Error('save dir config file error');
  }

  getList() {
    return this.dirList;
  }

  getDirNames() {
    return this.dirList.map((item) => item[0]);
  }
  getDirs() {
    return this.dirList.map((item) => item[1]);
  }

  async pushDir(dirName: DirName, dirPath: DirPath) {
    const findItem = this.dirList.find((item) => {
      if (item[0] === dirName) return true;
    });
    if (findItem) {
      findItem[1] = dirPath;
    } else this.dirList.push([dirName, dirPath]);
    await this._saveConf();
  }

  getDir(name: DirName) {
    const findItem = this.dirList.find((item) => {
      if (item[0] === name) return true;
    });
    if (findItem) return findItem[1];
    return undefined;
  }

  async rename(oldName: DirName, newName: DirName) {
    const findItem = this.dirList.find((item) => {
      if (item[0] === oldName) return true;
    });
    if (!findItem) {
      throw new Error(`dir ${oldName} is not exit`);
    }

    findItem[0] = newName;
    await this._saveConf();
    return true;
  }

  async delDir(delNames: string[]) {
    const exitNames = this.getDirNames();
    delNames.forEach((n) => {
      if (exitNames.includes(n)) return;
      throw new Error(`dir ${n} is not exit`);
    });

    const dirList = this.dirList.filter((item) => {
      if (delNames.includes(item[0])) return false;
      return true;
    });
    this.dirList = dirList;
    await this._saveConf();
  }
}

// 检查是否存储，如果不存储会创建，失败则返回 false
async function exitConfFile() {
  return await ensureFile(DIR_CONF_PATH)
    .then(() => true)
    .catch(() => false);
}

// 读取配置
async function readConf() {
  if (!(await exitConfFile())) {
    throw Error('dir config file not exist,you can try later');
  }

  return (
    new Promise((resolve, reject) => {
      readFile(DIR_CONF_PATH, 'utf-8', (err, data) => {
        if (err) {
          reject('Read dir config file error');
          return;
        }
        resolve(data.trim());
      });
    }) as Promise<string>
  ).then((data) => {
    if (data === '') return [];
    const dirList = data
      .split('\n')
      .map((v) => v.split('=').map((v) => v.trim())); // 分割，并且分割后取出多余空格
    return dirList as DirListItem[];
  });
}

function saveConf(dirList: DirListItem[]): Promise<boolean> {
  const saveStr = dirList
    .map((dirItem) => {
      return dirItem.join('=');
    })
    .join('\n');

  return new Promise((a, b) => {
    writeFile(
      DIR_CONF_PATH,
      saveStr,
      {
        encoding: 'utf-8',
      },
      (err) => {
        if (err) b(false);
        a(true);
      },
    );
  });
}

const dirMs = new DirMs();
export function onReady(cb: () => void) {
  readyPromise.then(cb);
}

export default dirMs;
