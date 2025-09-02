import { Assets } from "pixi.js";
import Logger from "../../utils/Logger";
import Game from "../Game";

import * as config from '../../config.json';
import { GameData } from "./Game2Types";
import TextCloud, { TextCloudAlign } from "./TextCloud";
import Avatar from "./Avatar";
import gsap from "gsap";

export default class Game2 extends Game {
  private gameData: GameData;
  private currentDialogueId: number = 0;
  private assets: any = null;

  private dialogueInterval: NodeJS.Timeout = null;

  async init() {
    super.init();
    this.app.displayPreloader();
    Logger.info('init', 'Game2');

    this.gameData = await this.loadConfig();
    if (!this.gameData) {
      throw new Error('Game2 missing game data');
    }

    await this.loadAssets();

    this.currentDialogueId = 0;

    this.startDialogues();
    this.app.hidePreloader();
  }
  destroy(): void {
    this.removeChildren();
    this.clearDialogues();
    super.destroy();
    Logger.info('destroy', 'Game2');
  }

  startDialogues() {
    this.dialogueInterval = setInterval(() => {
      this.createDialogue();
    }, 5000);
    this.createDialogue();
  }
  clearDialogues() {
    clearInterval(this.dialogueInterval);
    this.dialogueInterval = null;
  }

  getSide(position: string) {
    if (position === 'left') {
      return TextCloudAlign.LEFT;
    }
    return TextCloudAlign.RIGHT;
  }
  createDialogue() {
    const dialogue = this.getDialogue();
    if (!dialogue) {
      throw new Error("Missing dialogue");
    }

    this.removeChildren();
    const { text, name: avatarName } = dialogue;
    
    const avatar = this.getAvatar(avatarName);
    const avatarSide = this.getSide(avatar?.position || TextCloudAlign.CENTER);

    const textCloud = new TextCloud(this);
    textCloud.init(text, this.gameData.emojies, avatarSide);
    this.addChild(textCloud);

    const cloudMargin = 50;
    if (avatarSide === TextCloudAlign.LEFT) {
      textCloud.x = cloudMargin;
    } else if (avatarSide === TextCloudAlign.RIGHT) {
      textCloud.x = this.app.gameWidthWithPadding - textCloud.width - cloudMargin;
    } else if (avatarSide === TextCloudAlign.CENTER) {
      textCloud.x = (this.app.gameWidthWithPadding/2 - textCloud.width) / 2;
    }
    textCloud.y = this.app.gameHeightWithPadding - textCloud.height - cloudMargin;

    if (avatar) {
      const avatarSprite = new Avatar(avatar.name, avatar.position, avatar.url);
      avatarSprite.x = textCloud.x;
      if (avatarSide === TextCloudAlign.RIGHT) {
        avatarSprite.x = textCloud.x + textCloud.width - avatarSprite.width;
      }

      avatarSprite.y = textCloud.y - avatarSprite.height/2 + 40;
      
      this.addChild(avatarSprite);
      this.animateAvatar(avatarSprite);
    }

    this.updateCurrentDialogueIndex();
  }

  animateAvatar(avatar: Avatar) {
    const endY = avatar.y;
    avatar.y = avatar.y - avatar.height;
    avatar.alpha = 0;
    let tl = gsap.timeline();
    tl
      .to(avatar, {
        alpha: 1,
        duration: 0.01,
        ease: "circle.in"
      })
      .to(avatar, {
        y: endY,
        duration: 0.2,
        ease: "circ.out",
      });
  }
  getDialogue() {
    const dialogue = this.gameData.dialogue[this.currentDialogueId];
    return dialogue;
  }
  getAvatar(avatarName: string) {
    const avatar = this.gameData.avatars.find(avatar => avatar.name === avatarName);
    return avatar;
  }

  updateCurrentDialogueIndex() {
    this.currentDialogueId++;
    if (this.currentDialogueId >= this.gameData.dialogue.length) {
      this.currentDialogueId = 0;
    }
  }
  
  async loadConfig() {
    Logger.log(`loadConfig mode ${this.app.mode}`, 'App');

    const url = config[this.app.mode].dataUrl;
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
      Logger.error(error);
    }
  }
  async loadAssets() {
    if (!this.gameData) {
      throw new Error("Game2 missing game data");
    }

    // load avatars
    const { avatars } = this.gameData;
    const promises = [];
    for (const avatar of avatars) {
      promises.push(Assets.load(this.getAssetsForLoad(avatar)));
    }
    
    // laod emojis
    const { emojies: emojis } = this.gameData;
    for (const emoji of emojis) {
      promises.push(Assets.load(this.getAssetsForLoad(emoji)));
    }
    
    this.assets = await Promise.all(promises);
  }

  getAssetsForLoad(asset: { name: string, url: string }) {
    return {
      src: asset.url,
      alias: asset.name,
      loadParser: 'loadTextures',
      format: 'png'
    };
  }

  getAssetBundle(assets: { name: string, url: string }[]) {
    const assetsBundle = {};
    for (const asset of assets) {
      assetsBundle[asset.name] = asset.url;
    }
    return assetsBundle;
  }
}