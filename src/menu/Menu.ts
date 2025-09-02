import { Container, Graphics, Text } from "pixi.js";
import Logger from "../utils/Logger";
import App from "../App";
import { getCurrentLayoutType, LAYOUT_TYPE } from "../utils/Layout";

export default class Menu extends Container {
  app: App;

  private selectedButton: Container = null;
  private selectedGameIndex: number = -1;
  private elements: string[] = [
    'Ace of Shadows',
    'Magic Words',
    'Phoenix Flame',
  ];

  constructor(app: App) {
    super();
    this.app = app;
    Logger.log('Menu')
  }

  init() {
    Logger.log('init', 'Menu');
    for (let i = 0, length = this.elements.length; i < length; i++) {
      const element = this.elements[i];
      this.createButton(element, i);
    }

    this.pivot.x = 0;
    this.x = 0;
    this.y = 0;
  }

  createButton(string: string, index = 0) {
    const buttonContainer = new Container();
    this.addChild(buttonContainer);

    const buttonText = new Text(string, {
      fontSize: 20,
      fill: 0xffffff,
      align: 'center',
      wordWrap: false,
    });
    buttonText.anchor.set(0.5, 0.5);
    buttonText.eventMode = 'dynamic';
    buttonText.on('pointerdown', () => {
      if (this.selectedGameIndex === index) {
        return;
      }

      this.selectedGameIndex = index;
      this.updateBackground(buttonContainer, true, this.selectedButton);
      this.app.displayGame(index + 1);
    });

    const padding = 10;
    const background = new Graphics();
    background.beginFill(0x6F9F9C, 1);
    background.drawRoundedRect(-padding, -padding/2, buttonText.width + 2 * padding, buttonText.height + padding, 20);
    background.endFill();
    background.pivot.x = buttonText.width/2;
    background.pivot.y = buttonText.height/2;
    background.name = 'background';
    
    buttonContainer.addChild(background);
    buttonContainer.addChild(buttonText);
    this.buttonsVertically();
    this.updateBackground(buttonContainer, false);
  }

  buttonsVertically() {
    const posY = 50;
    for (const [index, child] of this.children.entries()) {
      child.pivot.x = 0;
      child.x = App.fullWidth / 2;
      child.y = posY * (index + 1);
    }
    this.pivot.x = 0;
  }

  updateBackground(buttonContainer: Container, isSelected: boolean = false, previousSelectedButton: Container = null) {
    if (previousSelectedButton) {
      this.updateBackground(previousSelectedButton, false);
    }
    const background = buttonContainer.getChildByName('background') as Graphics;
    if (!background) {
      return;
    }
    background.tint = isSelected ? 0xFFFFFF : 0x6F9F9C;
    this.selectedButton = isSelected ? buttonContainer : null;
  }
}