// src/features/farm/engine/scenes/FarmScene.ts
import Phaser from 'phaser';
import { useGameStore, getCropGrowthStage } from '../../state/useGameStore';
import type { TileData } from '../../types';

interface TileSpriteEntry {
  soilSprite: Phaser.GameObjects.Image | null;
  cropSprite: Phaser.GameObjects.Image | null;
  obstacleSprite?: Phaser.GameObjects.GameObject | null;
  placeableSprite?: Phaser.GameObjects.GameObject | null;
}

export default class FarmScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;  // 960px
  private readonly GRID_HEIGHT = 20; // 640px
  private playerSpeed = 160;

  private tileSprites = new Map<string, TileSpriteEntry>();
  private marker!: Phaser.GameObjects.Sprite;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private solidObstacleGroup!: Phaser.Physics.Arcade.StaticGroup;
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

    // 4. Static Physics Group for Solid Obstacles (Rocks & Logs)
    this.solidObstacleGroup = this.physics.add.staticGroup();

    // 5. Player Character
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
    // Tinh chỉnh hitbox va chạm phần chân (16x12px, offset 8, 20) cho chiều sâu 2.5D
    this.player.body.setSize(16, 12).setOffset(8, 20);

    // 6. Set Collider between Player and Solid Obstacles
    this.physics.add.collider(this.player, this.solidObstacleGroup);

    // 7. Keyboard Controls
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

  /**
   * Helper: Creates obstacle sprites with Arcade Physics static body for rock/wood
   * or a non-solid image for weeds so the player can walk through.
   */
  private createObstacleSprite(x: number, y: number, type: 'rock' | 'wood' | 'weed'): Phaser.GameObjects.GameObject {
    const obsTexture = `obstacle_${type}`;
    const hasAtlas = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(obsTexture);
    const tex = hasAtlas ? 'farm_atlas' : obsTexture;
    const frame = hasAtlas ? obsTexture : undefined;

    const px = x * this.TILE_SIZE;
    const py = y * this.TILE_SIZE;
    const depth = 10 + (py + 16) / 1000;

    if (type === 'rock' || type === 'wood') {
      // Solid obstacle: Static Arcade Physics body centered on tile
      const sprite = this.solidObstacleGroup.create(px + 16, py + 16, tex, frame) as Phaser.Physics.Arcade.Sprite;
      sprite.setOrigin(0.5, 0.5);
      sprite.setDepth(depth);
      // Inset body (26x20) for smooth corner sliding
      sprite.body.setSize(26, 20).setOffset(3, 6);
      sprite.refreshBody();
      return sprite;
    } else {
      // Non-solid obstacle: Weeds (player can walk through)
      const image = this.createImage(px, py, obsTexture).setOrigin(0, 0).setDepth(depth);
      return image;
    }
  }

  /**
   * Helper: Creates solid placeable structures (Fence & Chest) with Arcade Physics
   * static bodies so player cannot walk through them.
   */
  private createPlaceableSprite(x: number, y: number, type: 'fence' | 'chest'): Phaser.GameObjects.GameObject {
    const texName = `placeable_${type}`;
    const hasAtlas = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has(texName);
    const tex = hasAtlas ? 'farm_atlas' : texName;
    const frame = hasAtlas ? texName : undefined;

    const px = x * this.TILE_SIZE;
    const py = y * this.TILE_SIZE;
    const depth = 10 + (py + 16) / 1000;

    const sprite = this.solidObstacleGroup.create(px + 16, py + 16, tex, frame) as Phaser.Physics.Arcade.Sprite;
    sprite.setOrigin(0.5, 0.5);
    sprite.setDepth(depth);
    sprite.body.setSize(26, 20).setOffset(3, 6);
    sprite.refreshBody();
    return sprite;
  }

  private handleTileClick(x: number, y: number) {
    const store = useGameStore.getState();
    const activeTool = store.activeTool;
    const currentTile = store.tiles[`${x},${y}`];

    // Priority 0: Placing items from Hotbar (Fence or Chest)
    if (activeTool === 'item_fence' || activeTool === 'item_chest') {
      const placeType = activeTool === 'item_fence' ? 'fence' : 'chest';
      const res = store.placeEntity(x, y, placeType);
      if (res.success) {
        this.showFloatingText(x, y, `+ Đặt ${placeType === 'fence' ? 'Hàng rào gỗ' : 'Rương gỗ'}!`, '#38bdf8');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể đặt!', '#fb7185', true);
      }
      return;
    }

    // Priority 0.5: Fertilizer Application
    if (activeTool === 'item_fertilizer') {
      const res = store.fertilizeTile(x, y);
      if (res.success) {
        this.showFloatingText(x, y, '🧪 Bón phân sinh học (-50% time)!', '#4ade80');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể bón phân!', '#fb7185', true);
      }
      return;
    }

    // Priority 0.8: Interaction with existing Placeable Structures
    if (currentTile?.placeable) {
      if (activeTool === 'pickaxe') {
        const res = store.dismantleEntity(x, y);
        if (res.success) {
          this.showFloatingText(x, y, 'Thu hồi công trình (-2 Năng lượng)', '#facc15');
        } else {
          this.showFloatingText(x, y, res.reason || 'Không thể tháo dỡ!', '#fb7185', true);
        }
        return;
      }

      if (currentTile.placeable.type === 'chest') {
        this.game.events.emit('open-chest', `${x},${y}`);
        return;
      }

      if (currentTile.placeable.type === 'fence') {
        this.showFloatingText(x, y, 'Hàng rào gỗ (Dùng Cuốc chim để tháo dỡ)', '#fb7185', true);
        return;
      }
    }

    // Priority 1: Obstacle Interaction
    if (currentTile?.obstacle) {
      if (activeTool === 'axe' || activeTool === 'pickaxe' || activeTool === 'scythe') {
        const res = store.gatherResource(x, y);
        if (res.success) {
          if (res.destroyed) {
            this.showFloatingText(x, y, `+${res.resourceCount} ${res.resourceName} ${res.icon}`, '#38bdf8');
          } else {
            this.showFloatingText(x, y, `Trúng đích! (Còn ${res.remainingHp} HP)`, '#facc15');
            // Shake visual feedback
            const entry = this.tileSprites.get(`${x},${y}`);
            if (entry?.obstacleSprite) {
              const isSolid = currentTile.obstacle.type === 'rock' || currentTile.obstacle.type === 'wood';
              const targetSprite = entry.obstacleSprite as Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
              const baseX = isSolid ? x * this.TILE_SIZE + 16 : x * this.TILE_SIZE;
              const baseY = isSolid ? y * this.TILE_SIZE + 16 : y * this.TILE_SIZE;
              this.tweens.add({
                targets: targetSprite,
                x: baseX + (Math.random() > 0.5 ? 3 : -3),
                yoyo: true,
                duration: 50,
                repeat: 3,
                onComplete: () => {
                  targetSprite.setPosition(baseX, baseY);
                  if (isSolid) {
                    (targetSprite as Phaser.Physics.Arcade.Sprite).refreshBody?.();
                  }
                }
              });
            }
          }
        } else {
          this.showFloatingText(x, y, res.reason || 'Không thể khai thác!', '#fb7185', true);
        }
      } else {
        const obsName = currentTile.obstacle.type === 'rock' ? 'Đá cuội (Cần Cuốc chim)' 
          : currentTile.obstacle.type === 'wood' ? 'Khúc gỗ (Cần Rìu)' 
          : 'Cỏ dại (Cần Liềm)';
        this.showFloatingText(x, y, `Vướng ${obsName}!`, '#fb7185', true);
      }
      return;
    }

    if (activeTool === 'hoe') {
      const res = store.tillTile(x, y);
      if (res.success) {
        this.showFloatingText(x, y, 'Cuốc đất (-2 Năng lượng)', '#a3e635');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể cuốc!', '#fb7185', true);
      }
    } else if (activeTool === 'water_can') {
      const tileBefore = store.tiles[`${x},${y}`];
      const res = store.waterTile(x, y);
      if (res.success) {
        const msg = tileBefore?.crop ? 'Đã tưới nước (Cây bắt đầu lớn!)' : 'Đã tưới nước (-1 Năng lượng)';
        this.showFloatingText(x, y, msg, '#38bdf8');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể tưới!', '#fb7185', true);
      }
    } else if (activeTool.startsWith('seed_')) {
      const tileBefore = store.tiles[`${x},${y}`];
      const res = store.plantCrop(x, y, activeTool);
      if (res.success) {
        const msg = tileBefore?.isWatered
          ? `Gieo mầm ${res.cropName} (Đang phát triển)`
          : `Gieo mầm ${res.cropName} (Cần tưới nước!)`;
        this.showFloatingText(x, y, msg, tileBefore?.isWatered ? '#34d399' : '#fbbf24');
      } else {
        this.showFloatingText(x, y, res.reason || 'Không thể gieo hạt!', '#fb7185', true);
      }
    } else if (activeTool === 'hand') {
      const res = store.harvestCrop(x, y);
      if (res.success) {
        this.showFloatingText(x, y, `+1 ${res.cropName} (+${res.goldReward} Gold)`, '#fbbf24');
      } else {
        this.showFloatingText(x, y, res.reason || 'Chưa thể thu hoạch!', '#fb7185', true);
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
        if (entry.obstacleSprite) {
          if (this.solidObstacleGroup.contains(entry.obstacleSprite)) {
            this.solidObstacleGroup.remove(entry.obstacleSprite, true, true);
          } else {
            (entry.obstacleSprite as Phaser.GameObjects.GameObject).destroy();
          }
        }
        if (entry.placeableSprite) {
          if (this.solidObstacleGroup.contains(entry.placeableSprite)) {
            this.solidObstacleGroup.remove(entry.placeableSprite, true, true);
          } else {
            (entry.placeableSprite as Phaser.GameObjects.GameObject).destroy();
          }
        }
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
        entry = { soilSprite: null, cropSprite: null, obstacleSprite: null, placeableSprite: null };
        this.tileSprites.set(key, entry);
      }

      // 1. Soil texture update
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

      // 2. Crop texture update
      if (tile.crop) {
        const growth = getCropGrowthStage(tile.crop, tile.isWatered);
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

      // 3. Obstacle texture & physics update
      if (tile.obstacle) {
        if (!entry.obstacleSprite) {
          entry.obstacleSprite = this.createObstacleSprite(x, y, tile.obstacle.type);
        } else {
          // If obstacle type changed between solid (rock/wood) and non-solid (weed)
          const isCurrentlySolid = this.solidObstacleGroup.contains(entry.obstacleSprite);
          const shouldBeSolid = tile.obstacle.type === 'rock' || tile.obstacle.type === 'wood';

          if (isCurrentlySolid !== shouldBeSolid) {
            if (isCurrentlySolid) {
              this.solidObstacleGroup.remove(entry.obstacleSprite, true, true);
            } else {
              (entry.obstacleSprite as Phaser.GameObjects.GameObject).destroy();
            }
            entry.obstacleSprite = this.createObstacleSprite(x, y, tile.obstacle.type);
          }
        }
      } else if (entry.obstacleSprite) {
        if (this.solidObstacleGroup.contains(entry.obstacleSprite)) {
          this.solidObstacleGroup.remove(entry.obstacleSprite, true, true);
        } else {
          (entry.obstacleSprite as Phaser.GameObjects.GameObject).destroy();
        }
        entry.obstacleSprite = null;
      }

      // 4. Placeable structure texture & solid physics update
      if (tile.placeable) {
        if (!entry.placeableSprite) {
          entry.placeableSprite = this.createPlaceableSprite(x, y, tile.placeable.type);
        }
      } else if (entry.placeableSprite) {
        if (this.solidObstacleGroup.contains(entry.placeableSprite)) {
          this.solidObstacleGroup.remove(entry.placeableSprite, true, true);
        } else {
          (entry.placeableSprite as Phaser.GameObjects.GameObject).destroy();
        }
        entry.placeableSprite = null;
      }
    }
  }

  private updateCropVisuals() {
    const tiles = useGameStore.getState().tiles;
    const now = Date.now();

    for (const [key, tile] of Object.entries(tiles)) {
      if (tile.crop) {
        const entry = this.tileSprites.get(key);
        const growth = getCropGrowthStage(tile.crop, tile.isWatered, now);
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
