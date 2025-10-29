// utils/logger.js
import chalk from 'chalk';
export function log(...args) {
  console.log(chalk.blue('[IG-BOT]'), ...args);
}
