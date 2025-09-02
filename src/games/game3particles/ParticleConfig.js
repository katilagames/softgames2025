export default class ParticleConfig {
  getFireConfig(texture) {
    return {
      lifetime: {
        min: 0,
        max: 35,
      },
      frequency: 0.1,
      blendMode: "add",
      emitterLifetime: -1,
      maxParticles: 10,
      addAtBack: false,
      spawnType: "point",
      pos: {
        x: 0,
        y: 0,
      },
      behaviors: [
        {
          type: "alpha",
          config: {
            alpha: {
              list: [
                {
                  time: 0,
                  value: 1,
                },
                {
                  time: 1,
                  value: 0.68,
                },
              ],
            },
          },
        },
        {
          type: "moveAcceleration",
          config: {
            accel: {
              x: 0.01,
              y: 0.2,
            },
            // maxSpeed: 0.1,
            // minStart: 0.01,
            // maxStart: 0.1,
          },
        },
        {
          type: "moveSpeed",
          config: {
            speed: {
              list: [
                {
                  time: 0,
                  value: 0.75,
                },
                {
                  time: 0.3,
                  value: 0.5,
                },
                {
                  time: 1,
                  value: 0.1,
                },
              ],
            },
            minMult: 0.01,
          },
        },
        {
          type: "scale",
          config: {
            scale: {
              list: [
                {
                  time: 0,
                  value: 0.35,
                },
                {
                  time: 0.5,
                  value: 0.20,
                },
                {
                  time: 1,
                  value: 0.05,
                },
              ],
            },
            minMult: 10,
          },
        },
        {
          type: "color",
          config: {
            color: {
              list: [
                {
                  time: 0,
                  value: "#ffac12",
                },
                {
                  time: 0.75,
                  value: "#ffac12",
                },
                {
                  time: 1,
                  value: "#ff0505",
                },
              ],
            },
          },
        },
        {
          type: "rotation",
          config: {
            accel: 0,
            minSpeed: 3,
            maxSpeed: 20,
            minStart: -97,
            maxStart: -83,
          },
        },
        {
          type: "textureRandom",
          config: {
            textures: [texture],
          },
        },
        {
          type: "spawnPoint",
          config: {},
        },
      ],
    };
  }
  getWaterConfig() {
    // TODO
    throw Error("Missing Water Config object");
    return {};
  }
}

