import { Application, Container } from "pixi.js";
import Menu from "./menu/Menu";
import Logger from "./utils/Logger";
import * as config from './config.json';
import Game1 from "./games/game1cards/Game1";

import "./main.css";
import Game3 from "./games/game3particles/Game3";
import Game2 from "./games/game2avatars/Game2";
import { getGameSize } from "./utils/Layout";

export default class App {
  private menu: Menu = null;
  private pixiApp: Application<HTMLCanvasElement> = null;
  private container: Container;
  private gameData: JSON;

  public gameWidth = 1000;
  public gameHeight = 1000;
  public gamePaddingPerc = 0.1;

  private currentGame: Game1 | Game2 | Game3;

  constructor() {
    Logger.log('init', 'App');
    this.scaleApp = this.scaleApp.bind(this);

    this.init();
  }

  async init() {
    this.scaleApp();

    this.pixiApp = new Application({
      // width: this.gameWidth,
      // height: this.gameHeight,
      resolution: App.pixelRatio,
      backgroundColor: '#212721ff',
      antialias: true,
      autoDensity: true,
      resizeTo: window,
    });

    document.body.appendChild(this.pixiApp.view);

    this.menu = new Menu(this);

    this.gameData = await this.loadConfig();

    this.container = new Container();
    this.container.x = this.app.screen.width/2;
    this.container.y = this.app.screen.height/2;
    this.stage.addChild(this.container);
    
    this.displayGame(GAME_TYPE.ACE_OF_SHADOWS);

    window.addEventListener('resize', this.scaleApp);
    
  }
  destroy() {
    window.removeEventListener('resize', this.scaleApp);

    Logger.log('destroy', 'App');
  }

  get app() {
    return this.pixiApp;
  }
  get stage() {
    return this.pixiApp.stage;
  }
  get appContainer() {
    return this.container;
  }
  get mode() {
    return process.env.MODE;
  }

  get gameWidthWithPadding() {
    return this.gameWidth - (this.gameWidth * this.gamePaddingPerc);
  }
  get gameHeightWithPadding() {
    return this.gameHeight - (this.gameHeight * this.gamePaddingPerc);
  }

  displayMenu() {

  }
  hideMenu() {

  }

  displayGame(gameType: GAME_TYPE) {
    const games = [Game1, Game2, Game3];
    this.currentGame = new games[gameType - 1](this);
    this.currentGame.init();
  }
  hideGame() {
    if (!this.currentGame) {
      return;
    }

    this.currentGame.destroy();
  }

  async loadConfig() {
    Logger.log(`loadConfig mode ${this.mode}`, 'App');

    const url = config[this.mode].dataUrl;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response) {
        throw new Error('Loading data failed');
      }
      
      return await response.json();
    } catch(error) {
      console.error(error);
    }
  }

  updateGameSize() {
    const { width, height} = getGameSize();

    this.gameWidth = width;
    this.gameHeight = height;
  }
  scaleApp() {
    this.updateGameSize();
  }

  public static get fullWidth(): number {
    return window.innerWidth || 0;
  }
  public static get fullHeight(): number {
    return window.innerHeight || 0;
  }
  public static get pixelRatio(): number {
    return window.devicePixelRatio || 1;
  }
}

export enum GAME_TYPE {
    ACE_OF_SHADOWS = 1,
    MAGIC_WORDS =  2,
    PHOENIX_FLAME = 3,
}