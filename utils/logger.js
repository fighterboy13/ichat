import chalk from 'chalk';

export function log(...msg) {
  console.log(chalk.blue('[IG-BOT]'), ...msg);
}
