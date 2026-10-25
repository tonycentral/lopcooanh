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

interface PendingAction {
  gridX: number;
  gridY: number;
  targetX: number;
  targetY: number;
}

export default class FarmScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;  // 960px
  private readonly GRID_HEIGHT = 20; // 640px
  private readonly INTERACTION_RANGE = 48; // Max distance in px (~1.5 tiles)
  private readonly SANCTUARY_GRID_X = 15;
  private readonly SANCTUARY_GRID_Y = 3;
  private playerSpeed = 160;

  private pendingAction: PendingAction | null = null;
  private isPerformingAction = false;
  private currentToolSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | null = null;
  private currentActionTween: Phaser.Tweens.Tween | null = null;
  private actionImpactTimer: Phaser.Time.TimerEvent | null = null;

  private sanctuarySprite!: Phaser.Physics.Arcade.Sprite;
  private sanctuaryTooltip!: Phaser.GameObjects.Container;
  private interactKey!: Phaser.Input.Keyboard.Key;

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

    // 4b. Rest Sanctuary / Campfire Structure
    const campX = this.SANCTUARY_GRID_X * this.TILE_SIZE + 16;
    const campY = this.SANCTUARY_GRID_Y * this.TILE_SIZE + 16;
    this.sanctuarySprite = this.physics.add.sprite(campX, campY, 'structure_campfire');
    this.sanctuarySprite.setDepth(11);
    this.sanctuarySprite.setImmovable(true);
    (this.sanctuarySprite.body as Phaser.Physics.Arcade.Body).moves = false;
    this.sanctuarySprite.body.setSize(24, 20).setOffset(4, 10);
    this.solidObstacleGroup.add(this.sanctuarySprite);

    // Warm pulsing flame animation
    this.tweens.add({
      targets: this.sanctuarySprite,
      scaleY: { from: 1, to: 1.08 },
      scaleX: { from: 1, to: 0.95 },
      duration: 380,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Click on Campfire
    this.sanctuarySprite.setInteractive({ useHandCursor: true });
    this.sanctuarySprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.rightButtonDown()) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sanctuarySprite.x, this.sanctuarySprite.y);
      if (dist <= this.INTERACTION_RANGE) {
        this.openSanctuaryQuiz();
      } else {
        this.startAutoApproach(this.SANCTUARY_GRID_X, this.SANCTUARY_GRID_Y, this.sanctuarySprite.x, this.sanctuarySprite.y + 28);
      }
    });

    // Floating tooltip container above Campfire
    const tooltipBg = this.add.graphics();
    tooltipBg.fillStyle(0x0f172a, 0.9);
    tooltipBg.lineStyle(1.5, 0xf59e0b, 0.85);
    tooltipBg.fillRoundedRect(-110, -13, 220, 26, 8);
    tooltipBg.strokeRoundedRect(-110, -13, 220, 26, 8);

    const tooltipText = this.add.text(0, 0, '🔥 Bấm E hoặc Click để Luyện Tập', {
      fontSize: '11px',
      color: '#fef3c7',
      fontStyle: 'bold',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);

    this.sanctuaryTooltip = this.add.container(campX, campY - 30, [tooltipBg, tooltipText]);
    this.sanctuaryTooltip.setDepth(26);
    this.sanctuaryTooltip.setVisible(false);

    this.tweens.add({
      targets: this.sanctuaryTooltip,
      y: campY - 34,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

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
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
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
      if (this.isPerformingAction || this.isInputBlocked || pointer.button !== 0) return; // Ignore if acting or modal open

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
      this.cancelCurrentAction();
      this.stopMovement();
      if (this.marker) this.marker.setVisible(false);
      if (this.sanctuaryTooltip) this.sanctuaryTooltip.setVisible(false);
    } else {
      this.isPerformingAction = false;
    }
  }

  public openSanctuaryQuiz() {
    this.cancelCurrentAction();
    this.stopMovement();
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
    }
    this.isPerformingAction = true;
    this.updateFacingDirection(this.sanctuarySprite.x, this.sanctuarySprite.y);
    this.game.events.emit('open-vocab-quiz');
  }

  public cancelCurrentAction() {
    if (this.currentToolSprite) {
      this.currentToolSprite.destroy();
      this.currentToolSprite = null;
    }
    if (this.currentActionTween) {
      this.currentActionTween.stop();
      this.currentActionTween = null;
    }
    if (this.actionImpactTimer) {
      this.actionImpactTimer.remove();
      this.actionImpactTimer = null;
    }
    if (this.player) {
      this.player.setRotation(0);
      this.player.setScale(1);
    }
    this.isPerformingAction = false;
  }

  public stopMovement() {
    this.pendingAction = null;
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
      this.updatePlayerIdleAnimation();
    }
  }

  /**
   * Faces the player character towards target coordinates
   */
  private updateFacingDirection(targetX: number, targetY: number) {
    const dx = targetX - this.player.x;
    const dy = targetY - this.player.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.lastDirection = dx > 0 ? 'right' : 'left';
    } else {
      this.lastDirection = dy > 0 ? 'down' : 'up';
    }
    this.updatePlayerIdleAnimation();
  }

  update() {
    if (this.isPerformingAction) {
      if (this.player && this.player.body) {
        this.player.setVelocity(0, 0);
      }
      return;
    }

    if (this.isInputBlocked || (this.input.keyboard && !this.input.keyboard.enabled)) {
      this.stopMovement();
      return;
    }

    // Proximity check for Campfire / Rest Sanctuary & 'E' key interaction
    if (this.sanctuarySprite && this.sanctuaryTooltip) {
      const distToCampfire = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.sanctuarySprite.x,
        this.sanctuarySprite.y
      );
      const isNearCampfire = distToCampfire <= this.INTERACTION_RANGE;
      this.sanctuaryTooltip.setVisible(isNearCampfire && !this.isInputBlocked);

      if (isNearCampfire && !this.isInputBlocked && !this.isPerformingAction && this.interactKey) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          this.openSanctuaryQuiz();
          return;
        }
      }
    }

    let manualVx = 0;
    let manualVy = 0;

    if (this.cursors && this.wasd) {
      if (this.cursors.left.isDown || this.wasd.left.isDown) manualVx -= this.playerSpeed;
      if (this.cursors.right.isDown || this.wasd.right.isDown) manualVx += this.playerSpeed;
      if (this.cursors.up.isDown || this.wasd.up.isDown) manualVy -= this.playerSpeed;
      if (this.cursors.down.isDown || this.wasd.down.isDown) manualVy += this.playerSpeed;
    }

    // 1. Player Override: Manual keyboard control immediately cancels any automated approach
    if (manualVx !== 0 || manualVy !== 0) {
      this.pendingAction = null;

      if (manualVx !== 0 && manualVy !== 0) {
        manualVx *= 0.7071;
        manualVy *= 0.7071;
      }

      // Direction tracking
      if (manualVx < 0) {
        this.lastDirection = 'left';
      } else if (manualVx > 0) {
        this.lastDirection = 'right';
      } else if (manualVy < 0) {
        this.lastDirection = 'up';
      } else if (manualVy > 0) {
        this.lastDirection = 'down';
      }

      this.player.setVelocity(manualVx, manualVy);
      this.player.setDepth(10 + (this.player.y / 1000));

      const walkAnim = `walk_${this.lastDirection}`;
      if (this.anims.exists(walkAnim)) {
        this.player.anims.play(walkAnim, true);
      }
      return;
    }

    // 2. Auto-Approach Navigation to Target Tile
    if (this.pendingAction) {
      const targetCenterX = this.pendingAction.gridX * this.TILE_SIZE + 16;
      const targetCenterY = this.pendingAction.gridY * this.TILE_SIZE + 16;
      const distToTarget = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetCenterX, targetCenterY);
      const distToDest = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.pendingAction.targetX, this.pendingAction.targetY);

      // Check if player has arrived within interaction range
      if (distToTarget <= this.INTERACTION_RANGE || distToDest <= 8) {
        const { gridX, gridY } = this.pendingAction;
        this.pendingAction = null;
        this.player.setVelocity(0, 0);
        this.updateFacingDirection(targetCenterX, targetCenterY);

        if (gridX === this.SANCTUARY_GRID_X && gridY === this.SANCTUARY_GRID_Y) {
          this.openSanctuaryQuiz();
        } else {
          this.triggerTileInteraction(gridX, gridY);
        }
        return;
      }

      // Move player towards destination point
      this.physics.moveTo(this.player, this.pendingAction.targetX, this.pendingAction.targetY, this.playerSpeed);

      // Track facing direction from current physics velocity
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      const vx = body.velocity.x;
      const vy = body.velocity.y;

      if (Math.abs(vx) > Math.abs(vy)) {
        this.lastDirection = vx > 0 ? 'right' : 'left';
      } else if (Math.abs(vy) > 0) {
        this.lastDirection = vy > 0 ? 'down' : 'up';
      }

      this.player.setDepth(10 + (this.player.y / 1000));

      const walkAnim = `walk_${this.lastDirection}`;
      if (this.anims.exists(walkAnim)) {
        this.player.anims.play(walkAnim, true);
      }
      return;
    }

    // 3. Complete Idle State
    this.player.setVelocity(0, 0);
    this.updatePlayerIdleAnimation();
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

    // Register 5 action tool animations across 4 directions
    const actions: Array<'hoe' | 'water' | 'axe' | 'pickaxe' | 'scythe'> = ['hoe', 'water', 'axe', 'pickaxe', 'scythe'];
    for (const act of actions) {
      for (const dir of directions) {
        const animKey = `anim_${act}_${dir}`;
        if (!this.anims.exists(animKey)) {
          const frame0 = `player_${act}_${dir}_0`;
          const frame1 = `player_${act}_${dir}_1`;
          if (atlas.has(frame0) && atlas.has(frame1)) {
            this.anims.create({
              key: animKey,
              frames: [
                { key: 'farm_atlas', frame: frame0 },
                { key: 'farm_atlas', frame: frame1 }
              ],
              frameRate: 6,
              repeat: 0
            });
          } else if (atlas.has(`player_walk_${dir}_0`) && atlas.has(`player_walk_${dir}_1`)) {
            this.anims.create({
              key: animKey,
              frames: [
                { key: 'farm_atlas', frame: `player_walk_${dir}_0` },
                { key: 'farm_atlas', frame: `player_walk_${dir}_1` }
              ],
              frameRate: 6,
              repeat: 0
            });
          }
        }
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
    // Click directly on Campfire / Sanctuary tile
    if (x === this.SANCTUARY_GRID_X && y === this.SANCTUARY_GRID_Y) {
      const distToCamp = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sanctuarySprite.x, this.sanctuarySprite.y);
      if (distToCamp <= this.INTERACTION_RANGE) {
        this.openSanctuaryQuiz();
      } else {
        this.startAutoApproach(this.SANCTUARY_GRID_X, this.SANCTUARY_GRID_Y, this.sanctuarySprite.x, this.sanctuarySprite.y + 28);
      }
      return;
    }

    const targetCenterX = x * this.TILE_SIZE + 16;
    const targetCenterY = y * this.TILE_SIZE + 16;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetCenterX, targetCenterY);

    // Case 1: Within interaction range (dist <= INTERACTION_RANGE) -> trigger interaction
    if (dist <= this.INTERACTION_RANGE) {
      this.pendingAction = null;
      this.player.setVelocity(0, 0);
      this.updateFacingDirection(targetCenterX, targetCenterY);
      this.triggerTileInteraction(x, y);
      return;
    }

    // Case 2: Out of range -> Calculate approach destination and auto-walk
    const store = useGameStore.getState();
    const currentTile = store.tiles[`${x},${y}`];
    const isSolid = currentTile?.obstacle?.type === 'rock' ||
                    currentTile?.obstacle?.type === 'wood' ||
                    currentTile?.placeable?.type === 'fence' ||
                    currentTile?.placeable?.type === 'chest';

    let destX = targetCenterX;
    let destY = targetCenterY;

    if (isSolid) {
      // Find the closest walkable adjacent tile (North, South, West, East)
      const candidates = [
        { gx: x, gy: y - 1 },
        { gx: x, gy: y + 1 },
        { gx: x - 1, gy: y },
        { gx: x + 1, gy: y }
      ];

      let bestDist = Infinity;
      let foundSpot = false;

      for (const cand of candidates) {
        if (!this.isValidTile(cand.gx, cand.gy)) continue;
        const candTile = store.tiles[`${cand.gx},${cand.gy}`];
        const candSolid = candTile?.obstacle?.type === 'rock' ||
                          candTile?.obstacle?.type === 'wood' ||
                          candTile?.placeable?.type === 'fence' ||
                          candTile?.placeable?.type === 'chest';
        if (!candSolid) {
          const cx = cand.gx * this.TILE_SIZE + 16;
          const cy = cand.gy * this.TILE_SIZE + 16;
          const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, cx, cy);
          if (d < bestDist) {
            bestDist = d;
            destX = cx;
            destY = cy;
            foundSpot = true;
          }
        }
      }

      if (!foundSpot) {
        // Fallback: point 32px away along line from target to player
        const angle = Phaser.Math.Angle.Between(targetCenterX, targetCenterY, this.player.x, this.player.y);
        destX = targetCenterX + Math.cos(angle) * 32;
        destY = targetCenterY + Math.sin(angle) * 32;
      }
    } else {
      // Walkable target: aim near tile center
      const angle = Phaser.Math.Angle.Between(targetCenterX, targetCenterY, this.player.x, this.player.y);
      destX = targetCenterX + Math.cos(angle) * 16;
      destY = targetCenterY + Math.sin(angle) * 16;
    }

    this.startAutoApproach(x, y, destX, destY);
  }

  private startAutoApproach(gridX: number, gridY: number, destX: number, destY: number) {
    this.pendingAction = {
      gridX,
      gridY,
      targetX: destX,
      targetY: destY
    };
    this.physics.moveTo(this.player, destX, destY, this.playerSpeed);
    this.updateFacingDirection(destX, destY);
  }

  /**
   * Evaluates the tile target and triggers appropriate animation or immediate action
   */
  private triggerTileInteraction(x: number, y: number) {
    const store = useGameStore.getState();
    const activeTool = store.activeTool;
    const currentTile = store.tiles[`${x},${y}`];

    // Opening a chest (not using pickaxe) opens immediately without weapon swing
    if (currentTile?.placeable?.type === 'chest' && activeTool !== 'pickaxe') {
      this.executeTileAction(x, y);
      return;
    }

    // Determine animation tool type
    let actionType: 'hoe' | 'water' | 'axe' | 'pickaxe' | 'scythe' | null = null;
    if (activeTool === 'axe') actionType = 'axe';
    else if (activeTool === 'pickaxe') actionType = 'pickaxe';
    else if (activeTool === 'hoe') actionType = 'hoe';
    else if (activeTool === 'water_can') actionType = 'water';
    else if (activeTool === 'scythe') actionType = 'scythe';
    else if (activeTool === 'hand') actionType = 'scythe'; // harvesting reach

    if (actionType) {
      this.playActionAnimation(actionType, x, y, () => {
        this.executeTileAction(x, y);
      });
    } else {
      // Direct action for placing items, fertilizer, etc.
      this.executeTileAction(x, y);
    }
  }

  /**
   * Action Animation State Machine:
   * Locks player movement, plays directional swing tween & tool overlay,
   * synchronizes gameplay mutation at impact frame (~200ms), and returns to idle (~360ms).
   */
  private playActionAnimation(
    actionType: 'hoe' | 'water' | 'axe' | 'pickaxe' | 'scythe',
    gridX: number,
    gridY: number,
    onImpact: () => void
  ) {
    this.cancelCurrentAction();
    this.isPerformingAction = true;
    this.player.setVelocity(0, 0);

    const targetCenterX = gridX * this.TILE_SIZE + 16;
    const targetCenterY = gridY * this.TILE_SIZE + 16;
    this.updateFacingDirection(targetCenterX, targetCenterY);

    // 1. Play matching character animation if registered
    const animKey = `anim_${actionType}_${this.lastDirection}`;
    if (this.anims.exists(animKey)) {
      this.player.anims.play(animKey, true);
    }

    // 2. Procedural Player Body Swing / Recoil Tween
    const swingAngle = this.lastDirection === 'left' ? -0.22 : this.lastDirection === 'right' ? 0.22 : 0;
    this.currentActionTween = this.tweens.add({
      targets: this.player,
      rotation: swingAngle,
      scaleY: 0.9,
      scaleX: 1.08,
      duration: 170,
      yoyo: true,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.player.setRotation(0);
        this.player.setScale(1);
        this.currentActionTween = null;
      }
    });

    // 3. Procedural Tool Overlay Sprite & Swing
    const toolOverlayKey = `tool_overlay_${actionType}`;
    if (this.textures.exists(toolOverlayKey)) {
      let offsetX = 0;
      let offsetY = 0;
      let startRot = -0.7;
      let endRot = 0.7;
      let flipX = false;

      if (this.lastDirection === 'right') {
        offsetX = 10;
        offsetY = -2;
        startRot = -0.8;
        endRot = 0.8;
      } else if (this.lastDirection === 'left') {
        offsetX = -10;
        offsetY = -2;
        startRot = 0.8;
        endRot = -0.8;
        flipX = true;
      } else if (this.lastDirection === 'down') {
        offsetX = 8;
        offsetY = 4;
        startRot = -0.6;
        endRot = 0.7;
      } else if (this.lastDirection === 'up') {
        offsetX = -8;
        offsetY = -8;
        startRot = 0.6;
        endRot = -0.7;
      }

      const toolSprite = this.add.sprite(this.player.x + offsetX, this.player.y + offsetY, toolOverlayKey);
      toolSprite.setOrigin(0.5, 0.9);
      toolSprite.setRotation(startRot);
      toolSprite.setFlipX(flipX);
      toolSprite.setDepth(this.player.depth + 1);
      this.currentToolSprite = toolSprite;

      this.tweens.add({
        targets: toolSprite,
        rotation: endRot,
        duration: 320,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          toolSprite.destroy();
          if (this.currentToolSprite === toolSprite) {
            this.currentToolSprite = null;
          }
        }
      });
    }

    // 4. Synchronization at Impact Frame (at ~200ms / 60% of animation)
    this.actionImpactTimer = this.time.delayedCall(200, () => {
      if (!this.isPerformingAction) return;

      // Spawn visual impact particles & camera punch
      if (actionType === 'axe' || actionType === 'pickaxe') {
        this.spawnImpactParticles(targetCenterX, targetCenterY, 'fx_spark');
        this.cameras.main.shake(70, 0.003);
      } else if (actionType === 'hoe') {
        this.spawnImpactParticles(targetCenterX, targetCenterY, 'fx_dust');
      } else if (actionType === 'water') {
        this.spawnImpactParticles(targetCenterX, targetCenterY, 'fx_water_splash');
      } else if (actionType === 'scythe') {
        this.spawnImpactParticles(targetCenterX, targetCenterY, 'fx_spark');
      }

      // Execute gameplay mutation at exact impact
      onImpact();
    });

    // 5. Complete Action Cycle (at ~360ms) -> return to idle and unlock controls
    this.time.delayedCall(360, () => {
      if (this.currentToolSprite) {
        this.currentToolSprite.destroy();
        this.currentToolSprite = null;
      }
      this.player.setRotation(0);
      this.player.setScale(1);
      this.isPerformingAction = false;
      this.updatePlayerIdleAnimation();
    });
  }

  /**
   * Spawns burst particles that drift and fade on impact
   */
  private spawnImpactParticles(x: number, y: number, textureKey: string) {
    if (!this.textures.exists(textureKey)) return;
    for (let i = 0; i < 3; i++) {
      const p = this.add.image(x + (Math.random() - 0.5) * 12, y + (Math.random() - 0.5) * 12, textureKey);
      p.setDepth(25);
      p.setScale(0.8);
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 30;
      this.tweens.add({
        targets: p,
        x: p.x + Math.cos(angle) * speed,
        y: p.y + Math.sin(angle) * speed - 6,
        alpha: 0,
        scale: 0.3,
        duration: 350 + Math.random() * 150,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  private executeTileAction(x: number, y: number) {
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
    this.cancelCurrentAction();
    this.stopMovement();
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }
}
