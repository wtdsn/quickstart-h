# quickstart-h
quickstart-h 是一个帮助我们快速打开项目的工具。

**背景**
> 开发中，项目项目可能会放在 projects 目录下  , 比如 projects/a , projects/b，一些学习用的目录可能放在 learn 目录下，比如 learn/vue , learn/react ， 而一些非正式项目，可能放 practice 下，比如 practice/e , practice/d 。区分不同目录可以让不同类型的项目分类存放管理，但同时，目录多了，要创建一个项目，或者要打开一个项目可能就麻烦了一些。

此工具则提供不同项目目录的管理功能，和项目管理功能，从而帮助你快速创建，克隆一个项目到某个目录。帮助你快速在 vscode 中打开某个项目。\
功能并不强大，但希望能给你带来一些帮助或者乐趣等！

## 安装
`npm install quickstart-h -g` \
`yarn add quickstart-h -g`


## 主要功能包括：
1. 项目目录管理  `qs dir -h` \
目录是操作项目的基础，克隆项目是克隆到某个目录，打开项目也是基于某个项目打开
```shell
Usage: qs dir [options]

dir command is used to manage dirs

Options:
  -L,--list                      list all dirs
  -G,--get <name>                get dir by name. set "default" to get default dir
  -S,--set <name:path>           set dir
  -D,--delete <name...>          delete dir by names. if delete all,name can be .
  -R,--rename <oldName:newName>  rename dir
  -U,--use <name>                use it use default dir
  -h, --help                     display help for command
```

1. 项目管理 `qs pro -h`
```shell
Usage: qs pro [options]

Options:
  -I, --in <dirName>          the projects directory, if not set,it use default dir (default: "default")
  -L,--list                   list all the project
  -O, --open [projectName]    open the project in vscode
  -C, --create <projectName>  create a new project,add -O to auto open it after created
  --clone <giturl>            clone a project from github,add -O to auto open it after cloned
  -h, --help                  display help for command
```


## example
假设，我有一个 pro 目录， 用于存放一些正式的项目。\
一个 pra 目录，用于存放学习和练习的非正式项目。

#### 设置目录
命令：`qs dir -S,--set <name:path>` \
创建 pro 和 pra 项目，并且指定 path
```shell
> qs dir -S pro:/Users/wtdsn/projects
> qs dir -S pra:/Users/wtdsn/projects
```


#### 设置默认目录
命令： `qs dir -U,--sue <name>` \
设置 pro 为默认目录，在执行项目操作时，会默认基于此项目
```shell
> qs dir -U pro
```

#### 创建项目
命令 `qs pro -C,--create <projectName>` 在默认目录中创建项目 \
命令 `qs pro -C,--create <projectName> -I pra`  在 pra 目录中创建项目 \
目录 `qs pro -C,--create <projectName> -O` 在默认目录中创建项目，并且在 vscode 中打开
```shell
> qs pro -C projectA -I pra -O
```

#### 从 git 克隆项目
命令 `qs pro --clone <giturl>` 克隆项目到在默认目录中 \
命令 `qs pro --clone <giturl> -I pra`  在 pra 目录中克隆 \
目录 `qs pro --clone <giturl> -O` 在默认目录中克隆，并且在 vscode 中打开
```shell
> qs pro --clone https://github.com/wtdsn/quickstart-h.git -O
```

#### 在打开指定项目
命令 `qs pro -O,--open [projectA]` 在 vscode 打开默认目录中的 projectA ， 如果没有输入项目名，会显示默认目录下的所有项目以供选择。 \
命令  `qs pro -O,--open [projectA] -I pro` 在 vscode 中打开 pro 目录下的 projectA 项目。
```shell
> qs pro -O -I
```
