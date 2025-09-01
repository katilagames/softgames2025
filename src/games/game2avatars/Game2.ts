import Logger from "../../utils/Logger";
import Game from "../Game";

export default class Game2 extends Game {
  init(): void {
    super.init();
    Logger.info('init', 'Game2');
  }
}