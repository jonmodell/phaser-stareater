import {AUTO, Scale, Types} from 'phaser';

const Config: Types.Core.GameConfig = {
  type: AUTO,
  parent: 'game',
  backgroundColor: '#000000',
  scale: {
    width: 1400,
    height: 800,
    // mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      height: 800,
    } as Types.Physics.Arcade.ArcadeWorldConfig,
  } as Types.Core.PhysicsConfig,
};

export default Config;
