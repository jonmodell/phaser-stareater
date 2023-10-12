import {AUTO, Scale} from 'phaser';

const Config = {
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
    },
  },
};

export default Config;
