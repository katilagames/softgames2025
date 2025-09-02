import { Application, Container, Text } from "pixi.js";
import Menu from "./menu/Menu";
import Logger from "./utils/Logger";

import Game1 from "./games/game1cards/Game1";

import "./main.css";
import Game3 from "./games/game3particles/Game3";
import Game2 from "./games/game2avatars/Game2";
import { getGameSize } from "./utils/Layout";
import Preloader from "./utils/Preloader";

export default class App {
  private menu: Menu = null;
  private pixiApp: Application<HTMLCanvasElement> = null;
  private container: Container;

  public gameWidth = 1000;
  public gameHeight = 1000;
  public gamePaddingPerc = 0.1;

  private currentGame: Game1 | Game2 | Game3;
  private preloader: Preloader = null;

  private fpsDisplay: Text = null;
  constructor() {
    Logger.log('init', 'App');
    this.scaleApp = this.scaleApp.bind(this);

    this.init();
  }

  async init() {
    this.scaleApp();

    this.pixiApp = new Application({
      resolution: App.pixelRatio,
      backgroundColor: '#444444',
      antialias: true,
      autoDensity: true,
      resizeTo: window,
    });

    this.oEF = this.oEF.bind(this);
    this.pixiApp.ticker.add(this.oEF);

    document.body.appendChild(this.pixiApp.view);

    this.menu = new Menu(this);

    this.container = new Container();
    this.container.x = this.app.screen.width/2;
    this.container.y = this.app.screen.height/2;
    this.stage.addChild(this.container);
    
    this.displayMenu();
    // this.displayGame(GAME_TYPE.PHOENIX_FLAME);

    this.fpsDisplay = new Text("FPS", { fontSize: 12 });
    this.fpsDisplay.zIndex = 10000;
    this.fpsDisplay.x = 10;
    this.fpsDisplay.y = 10;

    this.pixiApp.stage.addChild(this.fpsDisplay);

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
    if (!this.menu) {
      this.menu = new Menu(this);
    }

    this.menu.init();
    this.stage.addChild(this.menu);
  }
  hideMenu() {
    this.stage.removeChild(this.menu);
    this.menu.destroy();
  }
  toggleMenu(isEnabled: boolean) {
    if (!this.menu) {
      return;
    }

    this.menu.alpha = isEnabled ? 1 : 0.5;
    this.menu.interactive = isEnabled;
    this.menu.interactiveChildren = isEnabled;
  }

  displayGame(gameType: GAME_TYPE) {
    this.hideGame();
    const games = [Game1, Game2, Game3];
    this.currentGame = new games[gameType - 1](this);
    this.currentGame.init();
  }
  hideGame() {
    if (!this.currentGame) {
      return;
    }

    this.stage.removeChild(this.currentGame);
    this.currentGame.destroy();
    this.currentGame = null;
  }

  displayPreloader() {
    if (!this.preloader) {
      this.preloader = new Preloader(this);
    }
    this.toggleMenu(false);
    
    this.stage.addChild(this.preloader);
    this.preloader.init();
    this.preloader.x = this.app.screen.width/2;
    this.preloader.y = this.app.screen.height/2;
  }
  hidePreloader() {
    if (!this.preloader) {
      return;
    }
    this.toggleMenu(true);

    this.stage.removeChild(this.preloader);
    this.preloader.destroy();
    this.preloader = null;
  }
  updateGameSize() {
    const { width, height} = getGameSize();

    this.gameWidth = width;
    this.gameHeight = height;
  }
  scaleApp() {
    this.updateGameSize();
  }

  oEF() {
    if (!this.fpsDisplay) {
      return;
    }
    this.fpsDisplay.text = `FPS: ${Math.round(this.pixiApp.ticker.FPS)}`;
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