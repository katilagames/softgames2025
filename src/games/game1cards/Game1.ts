import { Assets, IDestroyOptions, Texture } from "pixi.js";
import Game from "../Game";
import Card from "./Card";
import Logger from "../../utils/Logger";
import { degreeToRadian, getFromRange, plusMinus, radianToDegree } from "../../utils/Utils";
import gsap from "gsap";

export default class Game1 extends Game {
  private cardTexture: any = null;
  private cards: Card[] = [];
  private timeouts: NodeJS.Timeout[] = [];
  private moveInterval: NodeJS.Timeout = null;

  private cardsCount = 144;

  private cardTextureSize = {
    width: 285,
    height: 398,
  };

  private currentCardIndex = 0;
  private cardsShownNum = 0;
  private leftStackCardMovement = 0;
  private rightStackCardMovement = 0;

  async init() {
    super.init();
    this.sortableChildren = true;
    this.cardTexture = await Assets.load('img/card.png');

    if (!this.cardTexture) {
      throw new Error("Game1 Missing card texture");
    }

    this.leftStackCardMovement = this.getRandomCardMovement();
    this.rightStackCardMovement = this.getRandomCardMovement();

    this.cardsShownNum = 0;
    this.createCards();
    this.currentCardIndex = this.cards.length;

    if (!this.cards || this.cards.length === 0) {
      throw new Error("Game1 Missing cards");
    }

    this.showCards();
    
    Logger.info('init', 'Game1');
  }

  destroy(): void {
    this.stopShuffling();
    this.clearTimeouts();
    super.destroy();

    Logger.info('destroy', 'Game1');
  }

  clearTimeouts() {
    if (this.timeouts.length === 0) {
      return;
    }

    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    this.timeouts = [];
  }

  getCardsStackSettings() {
    const startYPos = this.getStartYPos(this.cardTextureSize.height);
    const availableHeight = this.getEndYPos(this.cardTextureSize.height) - startYPos;
    const cardsMargin = availableHeight/this.cardsCount;

    return {
      availableHeight,
      cardsMargin,
    };
  }

  getRandomCardMovement() {
    return 5 + Math.random() * 15;
  }
  createCards() {
    const startXPos = this.getStartXPos(this.cardTextureSize.width);
    const startYPos = this.getStartYPos(this.cardTextureSize.height);
    const { cardsMargin } = this.getCardsStackSettings();

    for (let i = 1; i <= this.cardsCount; i++) {
      const card = new Card(this.cardTexture);
      card.pivot.x = card.width/2;
      card.pivot.y = card.height/2;
      card.x = startXPos + radianToDegree(Math.cos(i / this.leftStackCardMovement));
      card.y = startYPos + (i * cardsMargin);
      card.zIndex = i;
      card.reversedZIndex = this.cardsCount - i;
      card.visible = false;

      this.cards.push(card);
      this.addChild(card);
    }
  }

  getNextCard() {
    if (this.currentCardIndex <= 0) {
      return;
    }

    this.currentCardIndex--;
    return this.cards[this.currentCardIndex];
  }

  showCards() {
    const delay = 0.05;

    for (let i = 0, length = this.cards.length; i < length; i++) {
      const card = this.cards[i];
    
      this.timeouts.push(setTimeout(() => {
          this.showNextCard(card, i);
      }, i * delay * 1000));
    }
  }
  checkIfReadyToShuffle() {
    if (this.cardsShownNum < this.cards.length) {
      return;
    }

    this.startShuffling();
  }
  startShuffling() {
    this.moveInterval = setInterval(() => {
      this.moveNextCard()
    }, 1000);
  }
  stopShuffling() {
    clearInterval(this.moveInterval);
    this.moveInterval = null;
  }
  moveNextCard() {
    const card = this.getNextCard();
    if (!card) {
      this.stopShuffling();
      return;
    }
    const endXPos = this.getEndXPos(this.cardTextureSize.width);
    const endYPos = this.getEndYPos(this.cardTextureSize.height);
    
    const { cardsMargin } = this.getCardsStackSettings();
    const cardFinalPosX = endXPos + radianToDegree(Math.cos(this.currentCardIndex / this.rightStackCardMovement));
    const cardFinalPoxY = endYPos - (this.currentCardIndex * cardsMargin);

    const animation = gsap.to(card, {
      rotation: 0,
      x: cardFinalPosX,
      y: cardFinalPoxY,
      duration: 2,
      onUpdate:  function() {
        if (animation.time() > 0.7) {
          card.zIndex = card.reversedZIndex;
        }
      }
    });
    
  }
  showNextCard(card: Card, cardIndex: number) {
    const isOdd = cardIndex > 0 && cardIndex%2 === 0;
    const maxX = 150;
    const maxMarginX = isOdd ? -maxX : maxX;
    const startX = card.x + maxMarginX;
    const endX = card.x;

    const maxMarginY = 50;
    const startY = card.y - maxMarginY;
    const endY = card.y;
    
    card.visible = true;
    card.x = startX;
    card.y = startY;

    const randomRotation = maxMarginX / 10;
    card.rotation = degreeToRadian(randomRotation);
    card.alpha = 0;

    let tl = gsap.timeline({
      onComplete: () => {
        this.cardsShownNum++;
        this.checkIfReadyToShuffle();
      },
    });
    tl
      .to(card, {
        alpha: 1,
        duration: 0.05,
        ease: "circle.in"
      })
      .to(card, {
        x: endX,
        y: endY,
        duration: 0.1,
        rotation: 0,
        ease: "circ.out",
      });
  }

  getStartXPos(cardWidth: number) {
    return cardWidth/2;
  }

  getStartYPos(cardHeight: number) {
    return cardHeight/2;
  }

  getEndXPos(cardWidth: number) {
    return this.app.gameWidthWithPadding - cardWidth/2;
  }
  
  getEndYPos(cardHeight: number) {
    return this.app.gameHeightWithPadding - cardHeight/2;
  }

}