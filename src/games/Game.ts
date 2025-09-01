import { Assets, Container } from "pixi.js";
import App from "../App";
import Logger from "../utils/Logger";

export default class Game extends Container {
  protected app: App;
  

  constructor(app) {
    super();
    Logger.log('Game');

    this.app = app;
    const { minRatio } = this.getMaxGameSize();

    this.scale.x = this.scale.y = minRatio;
    this.x = 0;
    this.y = 0;
    this.pivot.x = app.gameWidthWithPadding/2;
    this.pivot.y = app.gameHeightWithPadding/2;
    
    app.appContainer.addChild(this);
  }

  getMaxGameSize() {
    const ratioWidth = App.fullWidth/this.app.gameWidth;
    const ratioHeight = App.fullHeight/this.app.gameHeight;
    const minRatio = Math.min(ratioHeight, ratioWidth);

    return {
      ratioWidth,
      ratioHeight, 
      minRatio,
    }
  }
  init() {
    Logger.log('init', 'Game');
  }
  destroy() {
    Logger.log('destroy', 'Game');
  }
}