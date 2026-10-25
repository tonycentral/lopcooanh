// src/features/farm/engine/scenes/BootScene.ts
import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  private hasCustomAtlas = false;

  constructor() {
    super('BootScene');
  }

  preload() {
    // 1. Check for real Texture Atlas in public assets
    // URL: /assets/farm/atlas.png and /assets/farm/atlas.json
    this.load.atlas(
      'farm_atlas', 
      '/assets/farm/atlas.png', 
      '/assets/farm/atlas.json'
    );

    // Error handler for atlas load: If custom atlas is missing, flag fallback
    this.load.on('loaderror', (fileObj: Phaser.Loader.File) => {
      if (fileObj.key === 'farm_atlas') {
        console.info('[BootScene] No custom Texture Atlas detected at /assets/farm/atlas.json. Using procedural 32x32 textures.');
      }
    });

    this.load.on('filecomplete-atlas-farm_atlas', () => {
      this.hasCustomAtlas = true;
      console.info('[BootScene] Custom Texture Atlas loaded successfully from /assets/farm/');
    });

    // 2. Generate fallback procedural textures (guarantees game works out-of-the-box)
    this.createProceduralTextures();
  }

  create() {
    this.scene.start('FarmScene', { hasCustomAtlas: this.hasCustomAtlas });
  }

  private createProceduralTextures() {
    // 1. Grass Tile (32x32)
    if (!this.textures.exists('tile_grass')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x38733c, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x2f6333, 1);
      g.fillRect(4, 6, 2, 2);
      g.fillRect(18, 12, 2, 2);
      g.fillRect(24, 24, 2, 2);
      g.fillRect(8, 20, 2, 2);
      g.fillStyle(0x448a49, 1);
      g.fillRect(12, 4, 2, 2);
      g.fillRect(20, 18, 2, 2);
      g.generateTexture('tile_grass', 32, 32);
      g.destroy();
    }

    // 2. Tilled Soil (Dry) (32x32)
    if (!this.textures.exists('tile_soil_dry')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x6e472e, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x563723, 1);
      g.fillRect(0, 7, 32, 2);
      g.fillRect(0, 15, 32, 2);
      g.fillRect(0, 23, 32, 2);
      g.fillRect(0, 30, 32, 2);
      g.fillStyle(0x825537, 1);
      g.fillRect(0, 5, 32, 1);
      g.fillRect(0, 13, 32, 1);
      g.fillRect(0, 21, 32, 1);
      g.generateTexture('tile_soil_dry', 32, 32);
      g.destroy();
    }

    // 3. Tilled Soil (Watered/Wet) (32x32)
    if (!this.textures.exists('tile_soil_wet')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3d2516, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x2b190e, 1);
      g.fillRect(0, 7, 32, 2);
      g.fillRect(0, 15, 32, 2);
      g.fillRect(0, 23, 32, 2);
      g.fillRect(0, 30, 32, 2);
      g.fillStyle(0x5e3a24, 1);
      g.fillRect(6, 6, 2, 1);
      g.fillRect(20, 14, 2, 1);
      g.fillRect(10, 22, 2, 1);
      g.generateTexture('tile_soil_wet', 32, 32);
      g.destroy();
    }

    // 4. Crop Stages: Wheat (0, 1, 2, 3)
    if (!this.textures.exists('crop_wheat_0')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xe2b765, 1);
      g.fillRect(10, 16, 3, 2);
      g.fillRect(18, 14, 3, 2);
      g.fillRect(14, 20, 3, 2);
      g.generateTexture('crop_wheat_0', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_wheat_1')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x76b852, 1);
      g.fillRect(11, 14, 2, 6);
      g.fillRect(10, 12, 4, 2);
      g.fillRect(19, 12, 2, 8);
      g.fillRect(18, 10, 4, 2);
      g.generateTexture('crop_wheat_1', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_wheat_2')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x5c9e37, 1);
      g.fillRect(10, 8, 4, 14);
      g.fillRect(18, 6, 4, 16);
      g.fillStyle(0x8ed164, 1);
      g.fillRect(8, 12, 2, 4);
      g.fillRect(22, 10, 2, 4);
      g.generateTexture('crop_wheat_2', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_wheat_3')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xd99a2b, 1);
      g.fillRect(10, 4, 4, 18);
      g.fillRect(18, 2, 4, 20);
      g.fillStyle(0xfbc02d, 1);
      g.fillRect(8, 2, 8, 8);
      g.fillRect(16, 0, 8, 8);
      g.fillStyle(0xfff59d, 1);
      g.fillRect(10, 4, 4, 4);
      g.fillRect(18, 2, 4, 4);
      g.generateTexture('crop_wheat_3', 32, 32);
      g.destroy();
    }

    // 5. Crop Stages: Herb (0, 1, 2, 3)
    if (!this.textures.exists('crop_herb_0')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x9fa8a3, 1);
      g.fillRect(12, 16, 2, 2);
      g.fillRect(18, 18, 2, 2);
      g.generateTexture('crop_herb_0', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_herb_1')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x2e7d32, 1);
      g.fillRect(14, 14, 4, 6);
      g.generateTexture('crop_herb_1', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_herb_2')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x1b5e20, 1);
      g.fillRect(12, 10, 8, 12);
      g.fillStyle(0x4caf50, 1);
      g.fillRect(10, 12, 4, 4);
      g.fillRect(18, 12, 4, 4);
      g.generateTexture('crop_herb_2', 32, 32);
      g.destroy();
    }
    if (!this.textures.exists('crop_herb_3')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x1b5e20, 1);
      g.fillRect(10, 8, 12, 16);
      g.fillStyle(0xab47bc, 1);
      g.fillRect(12, 4, 4, 4);
      g.fillRect(18, 6, 4, 4);
      g.fillStyle(0xe1bee7, 1);
      g.fillRect(13, 5, 2, 2);
      g.generateTexture('crop_herb_3', 32, 32);
      g.destroy();
    }

    // 6. Farmer Avatar (32x32)
    if (!this.textures.exists('farmer_sprite')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xd4a373, 1);
      g.fillRect(8, 2, 16, 4);
      g.fillRect(6, 6, 20, 3);
      g.fillStyle(0xffcad4, 1);
      g.fillRect(10, 9, 12, 7);
      g.fillStyle(0x2b2d42, 1);
      g.fillRect(12, 11, 2, 2);
      g.fillRect(18, 11, 2, 2);
      g.fillStyle(0x2a6f97, 1);
      g.fillRect(8, 16, 16, 9);
      g.fillStyle(0x4a4e69, 1);
      g.fillRect(9, 25, 5, 5);
      g.fillRect(18, 25, 5, 5);
      g.generateTexture('farmer_sprite', 32, 32);
      g.destroy();
    }

    // 7. Marker outline (32x32)
    if (!this.textures.exists('tile_marker')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.lineStyle(2, 0xffffff, 0.9);
      g.strokeRect(1, 1, 30, 30);
      g.fillStyle(0xffffff, 0.15);
      g.fillRect(2, 2, 28, 28);
      g.generateTexture('tile_marker', 32, 32);
      g.destroy();
    }
  }
}
