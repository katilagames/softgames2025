import { Assets, Texture } from "pixi.js";
import Game from "../Game";
import Card from "./Card";
import Logger from "../../utils/Logger";

export default class Game1 extends Game {
  private cardTexture: any = null;
  private cards: Card[] = [];

  private cardsCount = 144;

  async init() {
    super.init();
    this.cardTexture = await Assets.load('img/card.png');

    if (!this.cardTexture) {
      throw new Error("Game1 Missing card texture");
    }

    this.createCards();

    this.addChild(this.cards[0]);
    
    this.cards[1].x = this.app.gameWidthWithPadding - this.cards[1].width;
    this.addChild(this.cards[1]);

    this.cards[2].x = this.app.gameWidthWithPadding - this.cards[2].width;
    this.cards[2].y = this.app.gameHeightWithPadding - this.cards[2].height;
    this.addChild(this.cards[2]);

    this.cards[3].y = this.app.gameHeightWithPadding - this.cards[3].height;
    this.addChild(this.cards[3]);

    Logger.log('init', 'Game1');
  }

  createCards() {
    for (let i = 1; i <= this.cardsCount; i++) {
      const card = new Card(this.cardTexture);

      this.cards.push(card);
    }
  }

}