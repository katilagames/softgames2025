import Logger from "../../utils/Logger";
import Game from "../Game";

import { Texture, ParticleContainer, BLEND_MODES, Assets } from "pixi.js";
import * as particles from "@pixi/particle-emitter";
import { EmitterConfigV3 } from "@pixi/particle-emitter";
import ParticleConfig from "./ParticleConfig";

export default class Game3 extends Game {
  private emitter: particles.Emitter;
  private emitterContainer: ParticleContainer;
  private emitterConfig: EmitterConfigV3;

  private elapsed = Date.now();

  async init() {
    super.init();
    this.oEF = this.oEF.bind(this);
    Logger.info('init', 'Game3');

    this.app.displayPreloader();

    const particleImageUrl= 'img/particle.png';
    await Assets.load(particleImageUrl);

    if (!this.emitterContainer) this.emitterContainer = new ParticleContainer();
    this.emitterContainer.x =  this.app.gameWidthWithPadding / 2;
    this.emitterContainer.y = this.app.gameHeightWithPadding / 2;

    this.addChild(this.emitterContainer);

    this.emitterConfig = new ParticleConfig().getFireConfig(Texture.from(particleImageUrl));

    if (!this.emitter) {
      this.emitter = new particles.Emitter(
        this.emitterContainer,
        this.emitterConfig
      );
    }
    (this.emitterContainer as ParticleContainer).blendMode = BLEND_MODES.ADD;
    this.emitterContainer.scale.x = this.emitterContainer.scale.y = 5;

    this.emitter.emit = true;
    this.emitter.parent = this.emitterContainer;

    this.oEF(0);

    this.app.hidePreloader();
  }

  destroy(): void {
    if (this.emitter) {
      this.emitter.emit = false;
      this.emitter.cleanup();
      this.emitter.destroy();
      this.emitter = undefined;
    }
    this.removeChildren();
    super.destroy();
  }

  oEF(delta: number): void {
    if (!this.emitter) {
      return;
    }

    requestAnimationFrame(this.oEF);

    const now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;
    this.emitter.update(delta);
  }
}
