import { Container } from "pixi.js";
import Logger from "../utils/Logger";
import App from "../App";

export default class Menu extends Container {
  app: App;

  constructor(app: App) {
    super();
    this.app = app;
    Logger.log('Menu')
  }
}