import { Container, Text } from "pixi.js";
import App from "../App";

export default class Preloader extends Container {
  text: Text = null;
  app: App;
  constructor(app: App) {
    super();
    this.app = app;
  }
  init() {
    this.createText('Loading');
    this.pivot.x = this.text.width/2;
    this.pivot.y = this.text.height/2;
  }

  createText(text: string) {
    this.text = new Text(text, {
      fontSize: 26,
      fill: 0x000000,
      align: 'center',
      wordWrap: false,
    });
    this.addChild(this.text);
  }
}