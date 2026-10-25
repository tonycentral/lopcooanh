// src/features/farm/engine/scenes/BootScene.ts
import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  private hasCustomAtlas = false;

  constructor() {
    super('BootScene');
  }

  preload() {
    // 1. Check for real Texture Atlas in public assets
    // Vite base-aware path: works seamlessly on local dev server and GitHub Pages subpath
    const baseUrl = (import.meta.env.BASE_URL || './').replace(/\/$/, '') + '/';
    this.load.atlas(
      'farm_atlas', 
      `${baseUrl}assets/farm/atlas.png`, 
      `${baseUrl}assets/farm/atlas.json`
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

    // 8. Obstacle: Rock (32x32)
    if (!this.textures.exists('obstacle_rock')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Drop shadow
      g.fillStyle(0x0f172a, 0.35);
      g.fillEllipse(16, 25, 22, 8);
      // Main rock body
      g.fillStyle(0x64748b, 1);
      g.fillRoundedRect(5, 8, 22, 17, 6);
      // Dark shadow side
      g.fillStyle(0x475569, 1);
      g.fillRoundedRect(13, 13, 14, 12, 4);
      // Highlight facet
      g.fillStyle(0x94a3b8, 1);
      g.fillRoundedRect(7, 9, 8, 8, 3);
      g.fillStyle(0xcfd8dc, 1);
      g.fillRect(8, 10, 3, 3);
      // Crack lines
      g.fillStyle(0x334155, 1);
      g.fillRect(15, 11, 2, 6);
      g.fillRect(17, 16, 3, 2);
      g.generateTexture('obstacle_rock', 32, 32);
      g.destroy();
    }

    // 9. Obstacle: Wood Log (32x32)
    if (!this.textures.exists('obstacle_wood')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Drop shadow
      g.fillStyle(0x0f172a, 0.35);
      g.fillEllipse(16, 25, 24, 8);
      // Log bark (cylinder)
      g.fillStyle(0x5c3a21, 1);
      g.fillRoundedRect(4, 11, 24, 14, 4);
      g.fillStyle(0x452b19, 1);
      g.fillRect(6, 17, 20, 3);
      g.fillRect(8, 21, 16, 2);
      // Log cut end (annual rings)
      g.fillStyle(0xdeb887, 1);
      g.fillEllipse(9, 18, 10, 12);
      g.fillStyle(0xc49a6c, 1);
      g.fillEllipse(9, 18, 6, 8);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(9, 18, 2, 2);
      // Small moss / twig
      g.fillStyle(0x4caf50, 1);
      g.fillRect(18, 9, 3, 3);
      g.fillRect(20, 8, 2, 2);
      g.generateTexture('obstacle_wood', 32, 32);
      g.destroy();
    }

    // 10. Obstacle: Weeds (32x32)
    if (!this.textures.exists('obstacle_weed')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Clump of overgrown weeds
      g.fillStyle(0x2d6a4f, 1);
      g.fillTriangle(6, 28, 10, 8, 14, 28);
      g.fillTriangle(12, 28, 17, 5, 21, 28);
      g.fillTriangle(18, 28, 23, 10, 27, 28);
      // Secondary lighter blades
      g.fillStyle(0x52b788, 1);
      g.fillTriangle(9, 28, 13, 11, 16, 28);
      g.fillTriangle(16, 28, 20, 9, 24, 28);
      // Little wildflower / thistle
      g.fillStyle(0xfbbf24, 1);
      g.fillCircle(17, 7, 2.5);
      g.fillStyle(0xf59e0b, 1);
      g.fillCircle(17, 7, 1.2);
      g.generateTexture('obstacle_weed', 32, 32);
      g.destroy();
    }

    // 11. Placeable: Wooden Fence (32x32)
    if (!this.textures.exists('placeable_fence')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Drop shadow
      g.fillStyle(0x0f172a, 0.35);
      g.fillRect(3, 27, 26, 4);
      // Horizontal crossrails (back)
      g.fillStyle(0x6e472e, 1);
      g.fillRect(1, 11, 30, 4);
      g.fillRect(1, 21, 30, 4);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(1, 10, 30, 1);
      g.fillRect(1, 20, 30, 1);
      // Two vertical posts
      g.fillStyle(0x8b5a2b, 1);
      g.fillRect(4, 5, 6, 24);
      g.fillRect(22, 5, 6, 24);
      // Post highlights & caps
      g.fillStyle(0xa66d3b, 1);
      g.fillRect(4, 5, 2, 24);
      g.fillRect(22, 5, 2, 24);
      g.fillTriangle(4, 5, 7, 1, 10, 5);
      g.fillTriangle(22, 5, 25, 1, 28, 5);
      g.generateTexture('placeable_fence', 32, 32);
      g.destroy();
    }

    // 12. Placeable: Wooden Chest (32x32)
    if (!this.textures.exists('placeable_chest')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Drop shadow
      g.fillStyle(0x0f172a, 0.4);
      g.fillEllipse(16, 26, 26, 8);
      // Main chest box
      g.fillStyle(0x78350f, 1); // Dark amber/wood
      g.fillRoundedRect(4, 10, 24, 18, 3);
      // Planks shading
      g.fillStyle(0x92400e, 1);
      g.fillRect(6, 12, 20, 5);
      g.fillRect(6, 19, 20, 7);
      // Metal rim & bands
      g.fillStyle(0xd97706, 1); // Brass/Gold trim
      g.fillRect(4, 16, 24, 3);
      g.fillRect(7, 10, 2, 18);
      g.fillRect(23, 10, 2, 18);
      // Lock latch in center
      g.fillStyle(0xfef08a, 1);
      g.fillRect(14, 15, 4, 5);
      g.fillStyle(0x451a03, 1);
      g.fillRect(15, 17, 2, 2);
      g.generateTexture('placeable_chest', 32, 32);
      g.destroy();
    }

    // 13. Fertilizer indicator (32x32)
    if (!this.textures.exists('item_fertilizer')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x15803d, 1);
      g.fillRoundedRect(6, 6, 20, 20, 4);
      g.fillStyle(0x4ade80, 1);
      g.fillCircle(16, 16, 5);
      g.fillStyle(0xfef08a, 1);
      g.fillRect(15, 13, 2, 6);
      g.fillRect(13, 15, 6, 2);
      g.generateTexture('item_fertilizer', 32, 32);
      g.destroy();
    }

    // 14. Action Tool Overlays (24x24) for Swing Animations
    // Hoe
    if (!this.textures.exists('tool_overlay_hoe')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x78350f, 1); // Wood handle
      g.fillRect(10, 8, 4, 14);
      g.fillStyle(0x94a3b8, 1); // Steel hoe blade
      g.fillRect(4, 5, 16, 4);
      g.fillStyle(0xf1f5f9, 1); // Edge highlight
      g.fillRect(4, 5, 16, 1);
      g.generateTexture('tool_overlay_hoe', 24, 24);
      g.destroy();
    }

    // Water Can
    if (!this.textures.exists('tool_overlay_water')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x0284c7, 1); // Blue body
      g.fillRoundedRect(4, 8, 12, 12, 3);
      g.fillStyle(0x38bdf8, 1); // Spout & handle
      g.fillRect(15, 9, 6, 3);
      g.fillRect(18, 12, 3, 4);
      g.fillRect(2, 6, 3, 8);
      g.fillStyle(0xbae6fd, 1); // Water droplets
      g.fillCircle(20, 18, 1.5);
      g.fillCircle(22, 21, 1.5);
      g.generateTexture('tool_overlay_water', 24, 24);
      g.destroy();
    }

    // Axe
    if (!this.textures.exists('tool_overlay_axe')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x78350f, 1); // Haft
      g.fillRect(10, 6, 4, 16);
      g.fillStyle(0x64748b, 1); // Axe head
      g.fillRoundedRect(12, 3, 10, 9, 2);
      g.fillStyle(0xe2e8f0, 1); // Sharp curved blade edge
      g.fillRect(21, 3, 2, 9);
      g.generateTexture('tool_overlay_axe', 24, 24);
      g.destroy();
    }

    // Pickaxe
    if (!this.textures.exists('tool_overlay_pickaxe')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x78350f, 1); // Haft
      g.fillRect(10, 7, 4, 15);
      g.fillStyle(0x64748b, 1); // Curved double-pick head
      g.fillRect(2, 4, 20, 4);
      g.fillRect(1, 6, 2, 3);
      g.fillRect(21, 6, 2, 3);
      g.fillStyle(0xf1f5f9, 1); // Point tips
      g.fillRect(1, 8, 1, 1);
      g.fillRect(22, 8, 1, 1);
      g.generateTexture('tool_overlay_pickaxe', 24, 24);
      g.destroy();
    }

    // Scythe
    if (!this.textures.exists('tool_overlay_scythe')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x5c2b09, 1); // Long staff
      g.fillRect(8, 4, 3, 18);
      g.fillStyle(0x94a3b8, 1); // Curved scythe blade
      g.fillRect(10, 2, 12, 4);
      g.fillRect(18, 5, 4, 5);
      g.fillStyle(0xf8fafc, 1); // Gleaming blade edge
      g.fillRect(10, 2, 12, 1);
      g.generateTexture('tool_overlay_scythe', 24, 24);
      g.destroy();
    }

    // Impact FX: Sparks & Dust
    if (!this.textures.exists('fx_spark')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xfef08a, 1);
      g.fillRect(6, 2, 4, 12);
      g.fillRect(2, 6, 12, 4);
      g.fillStyle(0xffffff, 1);
      g.fillRect(6, 6, 4, 4);
      g.generateTexture('fx_spark', 16, 16);
      g.destroy();
    }

    if (!this.textures.exists('fx_dust')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xd97706, 0.7);
      g.fillCircle(8, 8, 5);
      g.fillStyle(0xb45309, 0.9);
      g.fillCircle(6, 7, 3);
      g.fillStyle(0xfde68a, 0.8);
      g.fillCircle(9, 6, 2);
      g.generateTexture('fx_dust', 16, 16);
      g.destroy();
    }

    if (!this.textures.exists('fx_water_splash')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x38bdf8, 0.8);
      g.fillCircle(4, 5, 2.5);
      g.fillCircle(11, 4, 2);
      g.fillCircle(8, 10, 3);
      g.fillStyle(0xe0f2fe, 1);
      g.fillRect(4, 4, 1, 1);
      g.fillRect(8, 9, 1, 1);
      g.generateTexture('fx_water_splash', 16, 16);
      g.destroy();
    }
  }
}
