// src/features/farm/engine/config.ts
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import FarmScene from './scenes/FarmScene';

export function createGameConfig(parentContainer: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: parentContainer,
    width: '100%',
    height: '100%',
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
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, FarmScene]
  };
}
