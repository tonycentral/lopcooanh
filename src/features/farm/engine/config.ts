// src/features/farm/engine/config.ts
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import FarmScene from './scenes/FarmScene';

export function createGameConfig(parentContainer: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: parentContainer,
    width: 960,
    height: 640,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    backgroundColor: '#0f172a',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, FarmScene]
  };
}
