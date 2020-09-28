import Phaser from 'phaser';
import scenes from './scenes';

export default {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.DOM.CENTER_BOTH,
    width: 800,
    height: 640,
    parent: 'content'
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 500 }
    }
  },
  scene: scenes
};