import { Command } from 'commander';
import { addDirCommand } from './dir.js';
import { addProCommand } from './pro.js';

export default function addCommand(program: Command) {
  addDirCommand(program);
  addProCommand(program);
}
