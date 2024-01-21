import { Command } from 'commander';
import { addDirCommand } from './dir';
import { addProCommand } from './pro';

export default function addCommand(program: Command) {
  addDirCommand(program);
  addProCommand(program);
}
