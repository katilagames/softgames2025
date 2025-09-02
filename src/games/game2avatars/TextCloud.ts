import { Container, Graphics, Sprite, Text } from "pixi.js";
import Game2 from "./Game2";
import { Game2Emojis } from "./Game2Types";
import Logger from "../../utils/Logger";
import gsap from "gsap";

export enum TextCloudAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}
export default class TextCloud extends Container {
  private game?: Game2;
  public text: string;
  private emojisList: Game2Emojis[] = [];

  private margin = 14;
  private fontSize = 50;
  private elementCount = 0;
  private currentRowContainer?: Container;

  private displayIndex = 0;
  private displayRowIndex = 0;

  private isAnimationEnabled = true;

  private align: TextCloudAlign = TextCloudAlign.LEFT;

  constructor(game?: Game2) {
    super();
    this.text = '';
    this.game = game;
    // this.x = this.game.app.gameWidthWithPadding/2;
  }
  
  init(text: string, emojisList: Game2Emojis[] = [], align = TextCloudAlign.LEFT) {
    this.text = text;
    this.emojisList = emojisList;
    this.align = align;
    this.elementCount = 0;

    const splitedText = this.getTextSplit(text);

    let rowCount = 0;
    let rowContainer = new Container();
    this.addChild(rowContainer);
    this.currentRowContainer = rowContainer;

    for (const text of splitedText) {
      const textTrimmed = text.trim();
      const isEmoji = this.isCommand(textTrimmed) && this.isEmojiExists(textTrimmed);
      const element = isEmoji ? this.createEmoji(textTrimmed) : this.createText(textTrimmed);
      
      if (rowContainer.width > this.getTextMaxWidth()) {
        rowContainer.removeChild(element);
        rowCount++;

        const newRowContainer = new Container();
        
        newRowContainer.x = 0;
        newRowContainer.y = rowCount * (this.fontSize + this.margin);
        this.addChild(newRowContainer);

        this.currentRowContainer = newRowContainer;
        rowContainer = newRowContainer;
        this.elementCount = 0;
      }
      element.x = this.currentRowContainer.width + (this.elementCount === 0 ? 0 : this.margin);
      rowContainer.addChild(element);
      this.elementCount++;
      
      element.alpha = this.isAnimationEnabled ? 0 : 1;
    }

    this.alignCloud();

    this.displayOneByOne();
    this.createBackground();
  }

  createBackground() {
    const padding = 20;
    const background = new Graphics();

    background.beginFill(0x6F9F9C, 1);
    background.drawRoundedRect(0, 0, this.width + padding * 2, this.height + padding * 2, 20);
    background.endFill();

    background.y = -padding;
    if (this.align === TextCloudAlign.LEFT) {
      background.x = -padding;
    } else if (this.align === TextCloudAlign.CENTER) {
      background.x = -this.width/2 - padding;
    } else if (this.align === TextCloudAlign.RIGHT) {
      background.x = -this.width - padding;
    }
    this.addChildAt(background, 0);
  }

  alignCloud() {
    if (this.align === TextCloudAlign.LEFT) {
      this.alignLeft();
    } else if (this.align === TextCloudAlign.CENTER) {
      this.alignCenter();
    } else if (this.align === TextCloudAlign.RIGHT) {
      this.alignRight();
    } 
  }
  alignLeft() {
    for (const child of this.children) {
      child.x = 0;
    }
    this.pivot.x = 0;
    this.align = TextCloudAlign.LEFT;
  }
  alignCenter() {
    for (const child of this.children) {
      const localBounds = child.getLocalBounds();
      child.x = -localBounds.width/2;
    }
    this.pivot.x = -this.width/2;
    this.align = TextCloudAlign.CENTER;
  }
  alignRight() {
    for (const child of this.children) {
      const localBounds = child.getLocalBounds();
      child.x = -localBounds.width;
    }
    this.pivot.x = -this.width;
    this.align = TextCloudAlign.RIGHT;
  }
  
  displayOneByOne() {
    if (!this.isAnimationEnabled) {
      return;
    }
    
    const element = this.getElementToAnimate();
    if (!element) {
      Logger.info('All elements displayed');
      return;
    }

    this.animateElement(element);
  }
  getElementToAnimate() {
    const row = this.children[this.displayRowIndex] as Container;
    if (!row) {
      Logger.info('No more rows to display');
      return;
    }

    const element = row.children[this.displayIndex];
    if (!element) {
      Logger.info('No more elements in row to display, moving to next row');
      this.displayIndex = 0;
      this.displayRowIndex++;
      return this.getElementToAnimate();
    }

    this.displayIndex++;
    return element;
  }
  
  animateElement(element: Sprite | Text) {
    element.alpha = 0;
    const endY = element.y;
    element.y = endY - 20;

    let tl = gsap.timeline({
      onComplete: () => {
        this.displayOneByOne();
      },
    });
    tl
      .to(element, {
        alpha: 1,
        duration: 0.01,
        ease: "circle.in"
      })
      .to(element, {
        y: endY,
        duration: 0.1,
        ease: "circ.out",
      });
  }
  isCommand(text: string) {
    return text.startsWith('{') && text.endsWith('}');
  }
  isEmojiExists(textTrimmed: string) {
    const emojiName = textTrimmed.slice(1, -1);
    const emojiData = this.emojisList.find(emoji => emoji.name === emojiName);
    return !!emojiData;
  }
  getTextSplit(text: string) {
    return text.split(' ');
  }

  createEmoji(textTrimmed: string) {
    const emojiName = textTrimmed.slice(1, -1);
    const emojiData = this.emojisList.find(emoji => emoji.name === emojiName);
    if (!emojiData) {
      Logger.warn(`Emoji not found: ${emojiName}`);
      return;
    }

    const emojiSprite = Sprite.from(emojiData.url);
    emojiSprite.width = this.fontSize;
    emojiSprite.height = this.fontSize;

    return emojiSprite;
  }

  createText(text: string) {
    const textObj = new Text(text, { fontSize: this.fontSize, fill: 0x000000, wordWrap: false, align: 'left', whiteSpace: 'normal' });
    return textObj;
  }

  getTextMaxWidth() {
    const maxWidth = 400;
    return Math.min(maxWidth, this.game?.app.gameWidthWithPadding);
  }
}