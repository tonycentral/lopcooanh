// src/features/farm/engine/scenes/FarmScene.ts
import Phaser from 'phaser';
import { useGameStore, getCropGrowthStage } from '../../state/useGameStore';
import type { TileData } from '../../types';

interface TileSpriteEntry {
  soilSprite: Phaser.GameObjects.Image | null;
  cropSprite: Phaser.GameObjects.Image | null;
}

export default class FarmScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;  // 960px
  private readonly GRID_HEIGHT = 20; // 640px
  private playerSpeed = 160;

  private tileSprites = new Map<string, TileSpriteEntry>();
  private marker!: Phaser.GameObjects.Sprite;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private unsubscribeStore: (() => void) | null = null;
  private hasCustomAtlas = false;
  private isInputBlocked = false;
  private lastDirection: 'down' | 'up' | 'left' | 'right' = 'down';

  constructor() {
    super('FarmScene');
  }

  init(data?: { hasCustomAtlas?: boolean }) {
    this.hasCustomAtlas = Boolean(data?.hasCustomAtlas);
  }

  create() {
    // 1. Build Base Grass Background
    this.createGrassField();

    // 2. Initialize Marker for Mouse Hover Highlight
    this.marker = this.add.sprite(0, 0, 'tile_marker').setOrigin(0, 0).setDepth(20);
    this.marker.setVisible(false);

    this.tweens.add({
      targets: this.marker,
      alpha: { from: 0.8, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // 3. Register Player Animations (if atlas provides directional frames)
    this.createPlayerAnimations();

    // 4. Player Character
    const initialFrame = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has('player_idle_down')
      ? 'player_idle_down'
      : undefined;

    if (initialFrame) {
      this.player = this.physics.add.sprite(15 * 32 + 16, 10 * 32 + 16, 'farm_atlas', initialFrame);
    } else {
      this.player = this.physics.add.sprite(15 * 32 + 16, 10 * 32 + 16, 'farmer_sprite');
    }
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(15);

    // 5. Keyboard Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      };
    }

    // 6. Mouse Interaction Listeners
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked) {
        this.marker.setVisible(false);
        return;
      }

      const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
      const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

      if (this.isValidTile(tileX, tileY)) {
        this.marker.setPosition(tileX * this.TILE_SIZE, tileY * this.TILE_SIZE);
        this.marker.setVisible(true);
      } else {
        this.marker.setVisible(false);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.button !== 0) return; // Ignore if modal open or non-left-click

      const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
      const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

      if (this.isValidTile(tileX, tileY)) {
        this.handleTileClick(tileX, tileY);
      }
    });

    // 7. Camera Setup
    this.cameras.main.setBounds(0, 0, this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Initial sync with Zustand store
    this.syncAllTiles();

    // Subscribe to Zustand state changes
    this.unsubscribeStore = useGameStore.subscribe((state) => {
      this.syncAllTiles(state.tiles);
    });

    // Periodic growth check every 1 second (Timestamp Delta Calculation)
    this.time.addEvent({
      delay: 1000,
      callback: () => this.updateCropVisuals(),
      loop: true
    });
  }

  /**
   * Modal context switch: disables or enables Phaser keyboard and mouse input
   */
  public setModalOpen(isOpen: boolean) {
    this.isInputBlocked = isOpen;
    if (this.input.keyboard) {
      this.input.keyboard.enabled = !isOpen;
    }
    if (isOpen) {
      this.stopMovement();
      if (this.marker) this.marker.setVisible(false);
    }
  }

  public stopMovement() {
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
      this.updatePlayerIdleAnimation();
    }
  }

  update() {
    if (this.isInputBlocked || (this.input.keyboard && !this.input.keyboard.enabled)) {
      this.stopMovement();
      return;
    }

    let vx = 0;
    let vy = 0;

    if (this.cursors && this.wasd) {
      if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= this.playerSpeed;
      if (this.cursors.right.isDown || this.wasd.right.isDown) vx += this.playerSpeed;
      if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= this.playerSpeed;
      if (this.cursors.down.isDown || this.wasd.down.isDown) vy += this.playerSpeed;
    }

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    // Direction tracking
    if (vx < 0) {
      this.lastDirection = 'left';
    } else if (vx > 0) {
      this.lastDirection = 'right';
    } else if (vy < 0) {
      this.lastDirection = 'up';
    } else if (vy > 0) {
      this.lastDirection = 'down';
    }

    this.player.setVelocity(vx, vy);
    this.player.setDepth(10 + (this.player.y / 1000));

    // Player walking/idle animation control
    if (vx !== 0 || vy !== 0) {
      const walkAnim = `walk_${this.lastDirection}`;
      if (this.anims.exists(walkAnim)) {
        this.player.anims.play(walkAnim, true);
      }
    } else {
      this.updatePlayerIdleAnimation();
    }
  }

  private updatePlayerIdleAnimation() {
    const idleAnim = `idle_${this.lastDirection}`;
    if (this.anims.exists(idleAnim)) {
      this.player.anims.play(idleAnim, true);
    } else if (this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(`player_idle_${this.lastDirection}`)) {
      this.player.setTexture('farm_atlas', `player_idle_${this.lastDirection}`);
    } else {
      this.player.anims.stop();
    }
  }

  /**
   * Helper: Registers 4-directional walk and idle animations if atlas has matching frames
   */
  private createPlayerAnimations() {
    if (!this.textures.exists('farm_atlas')) return;
    const atlas = this.textures.get('farm_atlas');

    const directions: Array<'down' | 'up' | 'left' | 'right'> = ['down', 'up', 'left', 'right'];
    for (const dir of directions) {
      const walk0 = `player_walk_${dir}_0`;
      const walk1 = `player_walk_${dir}_1`;
      const idle = `player_idle_${dir}`;

      if (atlas.has(walk0) && atlas.has(walk1) && !this.anims.exists(`walk_${dir}`)) {
        this.anims.create({
          key: `walk_${dir}`,
          frames: [
            { key: 'farm_atlas', frame: walk0 },
            { key: 'farm_atlas', frame: walk1 }
          ],
          frameRate: 6,
          repeat: -1
        });
      }

      if (atlas.has(idle) && !this.anims.exists(`idle_${dir}`)) {
        this.anims.create({
          key: `idle_${dir}`,
          frames: [{ key: 'farm_atlas', frame: idle }],
          frameRate: 1
        });
      }
    }
  }

  /**
   * Smart Texture Resolver: Seamlessly uses custom texture atlas if present,
   * otherwise falls back to procedural canvas texture.
   */
  private applyTexture(
    target: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    frameName: string
  ) {
    if (this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(frameName)) {
      target.setTexture('farm_atlas', frameName);
    } else {
      target.setTexture(frameName);
    }
  }

  private createImage(x: number, y: number, frameName: string): Phaser.GameObjects.Image {
    if (this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(frameName)) {
      return this.add.image(x, y, 'farm_atlas', frameName);
    }
    return this.add.image(x, y, frameName);
  }

  private isValidTile(x: number, y: number): boolean {
    return x >= 0 && x < this.GRID_WIDTH && y >= 0 && y < this.GRID_HEIGHT;
  }

  private createGrassField() {
    for (let x = 0; x < this.GRID_WIDTH; x++) {
      for (let y = 0; y < this.GRID_HEIGHT; y++) {
        this.createImage(x * this.TILE_SIZE, y * this.TILE_SIZE, 'tile_grass')
          .setOrigin(0, 0)
          .setDepth(0);
      }
    }
  }

  private handleTileClick(x: number, y: number) {
    const store = useGameStore.getState();
    const activeTool = store.activeTool;

    if (activeTool === 'hoe') {
      const res = store.tillTile(x, y);
      if (res.success) {
        this.showFloatingText(x, y, 'Cuốc đất (-2 Năng lượng)', '#a3e635');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể cuốc!', '#fb7185', true);
      }
    } else if (activeTool === 'water_can') {
      const res = store.waterTile(x, y);
      if (res.success) {
        this.showFloatingText(x, y, 'Đã tưới nước (-1 Năng lượng)', '#38bdf8');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể tưới!', '#fb7185', true);
      }
    } else if (activeTool.startsWith('seed_')) {
      const res = store.plantCrop(x, y, activeTool);
      if (res.success) {
        this.showFloatingText(x, y, `Gieo mầm ${res.cropName} (-1 Hạt)`, '#34d399');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể gieo hạt!', '#fb7185', true);
      }
    } else if (activeTool === 'hand') {
      const res = store.harvestCrop(x, y);
      if (res.success) {
        this.showFloatingText(x, y, `+1 ${res.cropName} (+${res.goldReward} Gold)`, '#fbbf24');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể thu hoạch!', '#fb7185', true);
      }
    }
  }

  private showFloatingText(tileX: number, tileY: number, text: string, color = '#ffffff', isWarning = false) {
    const px = tileX * this.TILE_SIZE + 16;
    const py = tileY * this.TILE_SIZE;

    const label = this.add.text(px, py, text, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11px',
      color: color,
      stroke: '#0f172a',
      strokeThickness: 3
    }).setOrigin(0.5, 1).setDepth(30);

    if (isWarning) {
      // Small horizontal shake for feedback warning
      this.tweens.add({
        targets: label,
        x: px + (Math.random() > 0.5 ? 4 : -4),
        y: py - 18,
        alpha: 0,
        duration: 1200,
        ease: 'Cubic.easeOut',
        onComplete: () => label.destroy()
      });
    } else {
      this.tweens.add({
        targets: label,
        y: py - 26,
        alpha: 0,
        duration: 1100,
        ease: 'Power1',
        onComplete: () => label.destroy()
      });
    }
  }

  public syncAllTiles(tiles: Record<string, TileData> = useGameStore.getState().tiles) {
    const currentKeys = new Set(Object.keys(tiles));

    // Cleanup unmapped sprites
    for (const [key, entry] of this.tileSprites.entries()) {
      if (!currentKeys.has(key)) {
        entry.soilSprite?.destroy();
        entry.cropSprite?.destroy();
        this.tileSprites.delete(key);
      }
    }

    for (const [key, tile] of Object.entries(tiles)) {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      const px = x * this.TILE_SIZE;
      const py = y * this.TILE_SIZE;

      let entry = this.tileSprites.get(key);
      if (!entry) {
        entry = { soilSprite: null, cropSprite: null };
        this.tileSprites.set(key, entry);
      }

      // Soil texture update
      if (tile.isTilled) {
        const soilTexture = tile.isWatered ? 'tile_soil_wet' : 'tile_soil_dry';
        if (!entry.soilSprite) {
          entry.soilSprite = this.createImage(px, py, soilTexture).setOrigin(0, 0).setDepth(1);
        } else {
          this.applyTexture(entry.soilSprite, soilTexture);
        }
      } else if (entry.soilSprite) {
        entry.soilSprite.destroy();
        entry.soilSprite = null;
      }

      // Crop texture update
      if (tile.crop) {
        const growth = getCropGrowthStage(tile.crop);
        const cropTexture = `crop_${tile.crop.id}_${growth.currentStage}`;

        if (!entry.cropSprite) {
          entry.cropSprite = this.createImage(px, py, cropTexture).setOrigin(0, 0).setDepth(5);
        } else {
          this.applyTexture(entry.cropSprite, cropTexture);
        }
      } else if (entry.cropSprite) {
        entry.cropSprite.destroy();
        entry.cropSprite = null;
      }
    }
  }

  private updateCropVisuals() {
    const tiles = useGameStore.getState().tiles;
    const now = Date.now();

    for (const [key, tile] of Object.entries(tiles)) {
      if (tile.crop) {
        const entry = this.tileSprites.get(key);
        const growth = getCropGrowthStage(tile.crop, now);
        const cropTexture = `crop_${tile.crop.id}_${growth.currentStage}`;

        if (entry?.cropSprite) {
          const hasAtlas = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(cropTexture);
          const currentIdentifier = hasAtlas ? entry.cropSprite.frame.name : entry.cropSprite.texture.key;

          if (currentIdentifier !== cropTexture) {
            this.applyTexture(entry.cropSprite, cropTexture);
            // Gentle bounce pop when crop advances to next stage
            this.tweens.add({
              targets: entry.cropSprite,
              scaleX: { from: 1.25, to: 1 },
              scaleY: { from: 1.25, to: 1 },
              duration: 350,
              ease: 'Back.easeOut'
            });
          }

          // Subtle ripe visual tint indicator when ready for harvest
          if (growth.isRipe && entry.cropSprite.tintTopLeft === 0xffffff) {
            entry.cropSprite.setTint(0xfff7cc);
          }
        } else if (entry && tile.isTilled) {
          const [xStr, yStr] = key.split(',');
          const px = parseInt(xStr, 10) * this.TILE_SIZE;
          const py = parseInt(yStr, 10) * this.TILE_SIZE;
          entry.cropSprite = this.createImage(px, py, cropTexture).setOrigin(0, 0).setDepth(5);
        }
      }
    }
  }

  shutdown() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }
}
