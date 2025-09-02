export default class Logger {
  static logsColors = {
    log: '#1057d2ff',
    info: '#ca6d21ff',
  }

  private static displayLog(str = '', color = Logger.logsColors.log, isBold = false) {
    let logCss =  `color: ${color}`
    if (isBold) {
      logCss += '; font-weight: bold';
    }
    console.log(`${str}`, logCss)
  }

  private static getClassName(className) {
    return className ? `[${className}] ` : '';
  }
  static log(str = '', className = '') {
    if (!str) {
      return;
    }
    Logger.displayLog(`%c ${Logger.getClassName(className)}${str}`, Logger.logsColors.log, true);
  }
  static info(str = '', className = '') {
    if (!str) {
      return;
    }

    Logger.displayLog(`%c ${Logger.getClassName(className)}${str}`, Logger.logsColors.info);
  }

  static warn(str = '', className = '') {
    if (!str) {
      return;
    }
    console.warn(`${Logger.getClassName(className)}${str}`);
  }

  static error(str = '', className = '') {
    if (!str) {
      return;
    }
    console.error(`${Logger.getClassName(className)}${str}`);
  }
}