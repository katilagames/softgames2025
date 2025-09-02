import { Container, Sprite, Text } from "pixi.js";

export default class Avatar extends Container {
  sprite: Sprite;
  name: string
  side: string
  url: string
  
  constructor(name: string, side: string, url: string) {
    super();
    this.name = name;
    this.side = side;
    this.url = url;
    this.createSprite();
    this.createText();
  }

  createSprite() {
    this.sprite = Sprite.from(this.url);
    this.sprite.anchor.set(0, 1);
    this.sprite.scale.set(1.5);
    this.addChild(this.sprite);
  }
  createText() {
    const text = new Text(this.name, {
      fontSize: 45,
      fill: 0x6F9F9C,
      align: 'center',
    });
    text.anchor.set(0.5, 0);
    text.x = this.sprite.width/2;
    text.y = 0;
    this.addChild(text);
  }
}