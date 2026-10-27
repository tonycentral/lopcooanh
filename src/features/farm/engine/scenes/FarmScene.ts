// src/features/farm/engine/scenes/FarmScene.ts
import Phaser from 'phaser';
import { useGameStore, getCropGrowthStage } from '../../state/useGameStore';
import type { TileData, BuildingType, LivestockData, EggEntityData, MovableEntityData } from '../../types';
import { findAStarPath, findBestAdjacentPath } from '../systems/Pathfinding';

interface TileSpriteEntry {
  soilSprite: Phaser.GameObjects.Image | null;
  cropSprite: Phaser.GameObjects.Image | null;
  obstacleSprite?: Phaser.GameObjects.GameObject | null;
  placeableSprite?: Phaser.GameObjects.GameObject | null;
}

interface PathWaypoint {
  gx: number;
  gy: number;
  wx: number;
  wy: number;
}

interface QueuedAction {
  targetGridX: number;
  targetGridY: number;
}

export default class FarmScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;  // 960px
  private readonly GRID_HEIGHT = 20; // 640px
  private readonly INTERACTION_RANGE = 48; // Max distance in px (~1.5 tiles)
  get SANCTUARY_GRID_X(): number {
    return useGameStore.getState().sanctuaryPosition?.x ?? 15;
  }
  get SANCTUARY_GRID_Y(): number {
    return useGameStore.getState().sanctuaryPosition?.y ?? 3;
  }
  get BBQ_GRID_X(): number {
    return useGameStore.getState().bbqPosition?.x ?? 18;
  }
  get BBQ_GRID_Y(): number {
    return useGameStore.getState().bbqPosition?.y ?? 3;
  }
  private playerSpeed = 160;

  private currentPath: PathWaypoint[] | null = null;
  private currentWaypointIndex = 0;
  private queuedAction: QueuedAction | null = null;
  private isPerformingAction = false;
  private currentToolSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | null = null;
  private currentActionTween: Phaser.Tweens.Tween | null = null;
  private actionImpactTimer: Phaser.Time.TimerEvent | null = null;

  private sanctuarySprite!: Phaser.Physics.Arcade.Sprite;
  private sanctuaryTooltip!: Phaser.GameObjects.Container;
  private bbqSprite!: Phaser.Physics.Arcade.Sprite;
  private bbqTooltip!: Phaser.GameObjects.Container;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  private mKey!: Phaser.Input.Keyboard.Key;

  // Reposition / Relocation Ghost Mode
  private repositionGhostGraphics?: Phaser.GameObjects.Graphics;
  private repositionNoticeText?: Phaser.GameObjects.Text;
  private repositionGhostSprite?: Phaser.GameObjects.Sprite;

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

  // Companion Pet Dog & Fetch Minigame
  private dog!: Phaser.Physics.Arcade.Sprite;
  private dogState: 'idle' | 'wander' | 'follow' | 'sit' | 'fetch' | 'return_stone' | 'chase_boar' = 'idle';
  private dogTargetX = 0;
  private dogTargetY = 0;
  private dogWanderTimer = 0;
  private dogSitTimer = 0;
  private dogEmoteContainer!: Phaser.GameObjects.Container;
  private dogEmoteText!: Phaser.GameObjects.Text;
  private dogStoneIcon!: Phaser.GameObjects.Image;
  private currentThrownStone: Phaser.GameObjects.Sprite | null = null;
  private fetchStoneTarget: { x: number; y: number } | null = null;

  // Wild Boar Pest AI
  private wildBoar: Phaser.Physics.Arcade.Sprite | null = null;
  private boarState: 'idle' | 'running_to_crop' | 'eating' | 'fleeing' = 'idle';
  private boarTargetGrid: { x: number; y: number } | null = null;
  private boarEatingTimer: Phaser.Time.TimerEvent | null = null;
  private boarSpawnTimer: Phaser.Time.TimerEvent | null = null;
  private boarEatingTween: Phaser.Tweens.Tween | null = null;
  private boarCooldownUntil = 0;
  private boarFleeTarget: { x: number; y: number } = { x: 0, y: 0 };

  // Outdoor House & Dynamic Farm Buildings
  private initialSpawnX?: number;
  private initialSpawnY?: number;
  private houseSignSprite?: Phaser.Physics.Arcade.Sprite;
  private houseTooltip?: Phaser.GameObjects.Container;
  private readonly HOUSE_GRID_X = 8;
  private readonly HOUSE_GRID_Y = 2;
  private buildingSprites = new Map<string, { sprite: Phaser.Physics.Arcade.Sprite; tooltip?: Phaser.GameObjects.Container }>();

  // Construction Placement Ghost Preview Mode
  private placementGhostGraphics?: Phaser.GameObjects.Graphics;
  private placementNoticeText?: Phaser.GameObjects.Text;

  // Livestock AI & Produce Dropped Entities
  private livestockSprites = new Map<string, {
    sprite: Phaser.Physics.Arcade.Sprite;
    data: LivestockData;
    wanderTimer: number;
    targetX: number;
    targetY: number;
    isPeckingOrGrazing: boolean;
  }>();
  private eggSprites = new Map<string, Phaser.GameObjects.Sprite>();

  constructor() {
    super('FarmScene');
  }

  init(data?: { hasCustomAtlas?: boolean; spawnX?: number; spawnY?: number }) {
    this.hasCustomAtlas = Boolean(data?.hasCustomAtlas);
    if (data?.spawnX !== undefined && data?.spawnY !== undefined) {
      this.initialSpawnX = data.spawnX;
      this.initialSpawnY = data.spawnY;
    }
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
        this.handleTileClick(this.SANCTUARY_GRID_X, this.SANCTUARY_GRID_Y);
      }
    });

    // Floating tooltip container above Campfire
    const tooltipBg = this.add.graphics();
    tooltipBg.fillStyle(0x0f172a, 0.9);
    tooltipBg.lineStyle(1.5, 0xf59e0b, 0.85);
    tooltipBg.fillRoundedRect(-110, -13, 220, 26, 8);
    tooltipBg.strokeRoundedRect(-110, -13, 220, 26, 8);

    const tooltipText = this.add.text(0, 0, '🔥 Nhấn E hoặc Click để Tương Tác', {
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

    // 4c. Barbecue Stand Structure (BBQ Stand)
    const bbqX = this.BBQ_GRID_X * this.TILE_SIZE + 16;
    const bbqY = this.BBQ_GRID_Y * this.TILE_SIZE + 16;
    this.bbqSprite = this.physics.add.sprite(bbqX, bbqY, 'structure_bbq_stand');
    this.bbqSprite.setDepth(11);
    this.bbqSprite.setImmovable(true);
    (this.bbqSprite.body as Phaser.Physics.Arcade.Body).moves = false;
    this.bbqSprite.body.setSize(26, 20).setOffset(3, 10);
    this.solidObstacleGroup.add(this.bbqSprite);

    // Sizzling grill pulse animation
    this.tweens.add({
      targets: this.bbqSprite,
      scaleY: { from: 1, to: 1.05 },
      scaleX: { from: 1, to: 0.97 },
      duration: 320,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Click on BBQ Stand
    this.bbqSprite.setInteractive({ useHandCursor: true });
    this.bbqSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.rightButtonDown()) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bbqSprite.x, this.bbqSprite.y);
      if (dist <= this.INTERACTION_RANGE) {
        this.openBBQStand();
      } else {
        this.handleTileClick(this.BBQ_GRID_X, this.BBQ_GRID_Y);
      }
    });

    // Floating tooltip container above BBQ Stand
    const bbqTooltipBg = this.add.graphics();
    bbqTooltipBg.fillStyle(0x0f172a, 0.9);
    bbqTooltipBg.lineStyle(1.5, 0xf97316, 0.85);
    bbqTooltipBg.fillRoundedRect(-110, -13, 220, 26, 8);
    bbqTooltipBg.strokeRoundedRect(-110, -13, 220, 26, 8);

    const bbqTooltipText = this.add.text(0, 0, '🍖 Nhấn E hoặc Click để Tương Tác', {
      fontSize: '11px',
      color: '#ffedd5',
      fontStyle: 'bold',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);

    this.bbqTooltip = this.add.container(bbqX, bbqY - 30, [bbqTooltipBg, bbqTooltipText]);
    this.bbqTooltip.setDepth(26);
    this.bbqTooltip.setVisible(false);

    this.tweens.add({
      targets: this.bbqTooltip,
      y: bbqY - 34,
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4c. Render Farm Buildings & Construction Foundation
    this.renderAllBuildings();
    this.syncLivestockSprites(useGameStore.getState().livestock || []);
    this.syncDroppedEggs(useGameStore.getState().droppedEggs || []);

    // 5. Player Character
    const initialFrame = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has('player_idle_down')
      ? 'player_idle_down'
      : undefined;

    const spawnX = this.initialSpawnX ?? (15 * 32 + 16);
    const spawnY = this.initialSpawnY ?? (10 * 32 + 16);
    this.initialSpawnX = undefined;
    this.initialSpawnY = undefined;

    if (initialFrame) {
      this.player = this.physics.add.sprite(spawnX, spawnY, 'farm_atlas', initialFrame);
    } else {
      this.player = this.physics.add.sprite(spawnX, spawnY, 'farmer_sprite');
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
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    // 6. Mouse Interaction Listeners
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked) {
        this.marker.setVisible(false);
        return;
      }

      const store = useGameStore.getState();
      const repositionMode = store.isRepositionMode;
      const movingEntity = store.movingEntity;

      if (repositionMode) {
        this.marker.setVisible(false);
        this.updateRepositionGhost(pointer, movingEntity);
        return;
      } else if (this.repositionGhostGraphics) {
        this.repositionGhostGraphics.clear();
        this.repositionNoticeText?.setVisible(false);
        this.repositionGhostSprite?.setVisible(false);
      }

      const placementMode = store.placementMode;
      if (placementMode) {
        this.marker.setVisible(false);
        this.updatePlacementGhost(pointer, placementMode);
        return;
      } else if (this.placementGhostGraphics) {
        this.placementGhostGraphics.clear();
        this.placementNoticeText?.setVisible(false);
      }

      const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
      const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

      if (this.isValidTile(tileX, tileY)) {
        this.marker.setPosition(tileX * this.TILE_SIZE, tileY * this.TILE_SIZE);
        const activeTool = useGameStore.getState().activeTool;
        if (activeTool === 'none') {
          this.marker.setTint(0x94a3b8);
        } else {
          this.marker.clearTint();
        }
        this.marker.setVisible(true);
      } else {
        this.marker.setVisible(false);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isPerformingAction || this.isInputBlocked) return;

      const store = useGameStore.getState();
      const repositionMode = store.isRepositionMode;
      const movingEntity = store.movingEntity;

      if (repositionMode) {
        if (pointer.rightButtonDown()) {
          if (movingEntity) {
            store.cancelRelocation();
          } else {
            store.toggleRepositionMode(false);
          }
          this.repositionGhostGraphics?.clear();
          this.repositionNoticeText?.setVisible(false);
          this.repositionGhostSprite?.setVisible(false);
          this.syncStationsPositions();
          return;
        }

        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
        const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

        if (movingEntity) {
          const res = store.relocateEntity(tileX, tileY);
          if (res.success) {
            this.createDustPuff(tileX * this.TILE_SIZE + 16, tileY * this.TILE_SIZE + 16);
            this.repositionGhostGraphics?.clear();
            this.repositionNoticeText?.setVisible(false);
            this.repositionGhostSprite?.setVisible(false);
            this.syncStationsPositions();
            this.renderAllBuildings();
          }
        } else {
          const res = store.pickUpEntity(tileX, tileY);
          if (res.success) {
            this.syncStationsPositions();
            this.renderAllBuildings();
          }
        }
        return;
      }

      // Check Shift + Click for quick pick-up & reposition
      if (pointer.event.shiftKey && pointer.button === 0) {
        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
        const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);
        const res = store.pickUpEntity(tileX, tileY);
        if (res.success) {
          this.syncStationsPositions();
          this.renderAllBuildings();
          return;
        }
      }

      const placementMode = store.placementMode;
      if (placementMode) {
        if (pointer.rightButtonDown()) {
          useGameStore.getState().cancelPlacementMode();
          this.placementGhostGraphics?.clear();
          this.placementNoticeText?.setVisible(false);
          return;
        }
        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
        const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);
        if (this.isAreaValidForBuilding(tileX, tileY, placementMode.width, placementMode.height)) {
          const res = useGameStore.getState().buildStructure(placementMode.type, tileX, tileY);
          if (res.success) {
            this.placementGhostGraphics?.clear();
            this.placementNoticeText?.setVisible(false);
            this.renderAllBuildings();
          }
        } else {
          this.showFloatingNotice('Vị trí đặt không hợp lệ!', worldPoint.x, worldPoint.y);
        }
        return;
      }

      if (pointer.button !== 0) return;

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
    let prevBuildings = useGameStore.getState().buildings;
    let prevLivestock = useGameStore.getState().livestock;
    let prevEggs = useGameStore.getState().droppedEggs;
    let prevHasHouse = useGameStore.getState().hasHouse;
    let prevSanc = useGameStore.getState().sanctuaryPosition;
    let prevBbq = useGameStore.getState().bbqPosition;
    let prevMoving = useGameStore.getState().movingEntity;

    this.syncStationsPositions();

    this.unsubscribeStore = useGameStore.subscribe((state) => {
      this.syncAllTiles(state.tiles);
      if (state.buildings !== prevBuildings || state.hasHouse !== prevHasHouse) {
        prevBuildings = state.buildings;
        prevHasHouse = state.hasHouse;
        this.renderAllBuildings();
      }
      if (state.livestock !== prevLivestock) {
        prevLivestock = state.livestock;
        this.syncLivestockSprites(state.livestock || []);
      }
      if (state.droppedEggs !== prevEggs) {
        prevEggs = state.droppedEggs;
        this.syncDroppedEggs(state.droppedEggs || []);
      }
      if (state.sanctuaryPosition !== prevSanc || state.bbqPosition !== prevBbq || state.movingEntity !== prevMoving) {
        prevSanc = state.sanctuaryPosition;
        prevBbq = state.bbqPosition;
        prevMoving = state.movingEntity;
        this.syncStationsPositions(state);
      }
    });

    // 8. Companion Dog Creation
    this.dog = this.physics.add.sprite(this.player.x + 28, this.player.y + 12, 'companion_dog');
    this.dog.setCollideWorldBounds(true);
    this.dog.setDepth(14);
    this.dog.body.setSize(20, 14).setOffset(6, 12);
    this.physics.add.collider(this.dog, this.solidObstacleGroup);

    // Dog interactive petting
    this.dog.setInteractive({ useHandCursor: true });
    this.dog.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.rightButtonDown()) return;
      this.showDogEmote('❤️ Gâu gâu!', 1800);
      useGameStore.getState().notify('🐕 Bạn đã vuốt ve chú chó cưng! Thật dễ thương!', 'info');
    });

    // Dog emote container (speech bubble / hearts / stone in mouth)
    const emoteBg = this.add.graphics();
    emoteBg.fillStyle(0x0f172a, 0.9);
    emoteBg.lineStyle(1.5, 0x38bdf8, 0.9);
    emoteBg.fillRoundedRect(-24, -10, 48, 20, 6);
    emoteBg.strokeRoundedRect(-24, -10, 48, 20, 6);

    this.dogEmoteText = this.add.text(0, 0, '🐾', {
      fontSize: '11px',
      fontStyle: 'bold',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5);

    this.dogStoneIcon = this.add.image(0, 0, 'item_stone_thrown').setScale(0.85);
    this.dogStoneIcon.setVisible(false);

    this.dogEmoteContainer = this.add.container(this.dog.x, this.dog.y - 20, [emoteBg, this.dogEmoteText, this.dogStoneIcon]);
    this.dogEmoteContainer.setDepth(28);
    this.dogEmoteContainer.setVisible(false);

    this.dogState = 'idle';
    this.dogTargetX = this.dog.x;
    this.dogTargetY = this.dog.y;

    // 9. Periodic Wild Boar Threat check (every 60s)
    this.boarSpawnTimer = this.time.addEvent({
      delay: 60000,
      callback: () => this.trySpawnWildBoar(),
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
      if (this.bbqTooltip) this.bbqTooltip.setVisible(false);
      if (this.houseTooltip) this.houseTooltip.setVisible(false);
    } else {
      this.isPerformingAction = false;
    }
  }

  public renderAllBuildings() {
    // Clear previous building sprites
    for (const entry of this.buildingSprites.values()) {
      this.solidObstacleGroup.remove(entry.sprite, true, true);
      entry.tooltip?.destroy();
    }
    this.buildingSprites.clear();

    if (this.houseSignSprite) {
      this.solidObstacleGroup.remove(this.houseSignSprite, true, true);
      this.houseSignSprite = undefined;
    }
    if (this.houseTooltip) {
      this.houseTooltip.destroy();
      this.houseTooltip = undefined;
    }

    const state = useGameStore.getState();
    const buildingsList = state.buildings || [];
    const hasAnyHouse = state.hasHouse || buildingsList.some((b) => b.type === 'house');

    // If no house built yet, show default foundation plot signboard at (8, 2)
    if (!hasAnyHouse) {
      const houseCenterX = (this.HOUSE_GRID_X + 1) * this.TILE_SIZE;
      const houseCenterY = (this.HOUSE_GRID_Y + 1) * this.TILE_SIZE;
      this.houseSignSprite = this.physics.add.sprite(houseCenterX, houseCenterY, 'house_plot_sign');
      this.houseSignSprite.setDepth(11);
      this.houseSignSprite.setImmovable(true);
      (this.houseSignSprite.body as Phaser.Physics.Arcade.Body).moves = false;
      this.houseSignSprite.body.setSize(24, 20).setOffset(4, 10);
      this.solidObstacleGroup.add(this.houseSignSprite);

      this.houseTooltip = this.add.container(houseCenterX, (this.HOUSE_GRID_Y + 2) * this.TILE_SIZE - 14);
      this.houseTooltip.setDepth(30).setVisible(false);
      const ttBg = this.add.graphics();
      ttBg.fillStyle(0x0f172a, 0.92);
      ttBg.lineStyle(1.5, 0xf59e0b, 0.9);
      ttBg.fillRoundedRect(-125, -13, 250, 26, 8);
      ttBg.strokeRoundedRect(-125, -13, 250, 26, 8);
      const ttTxt = this.add.text(0, 0, '🔨 [E] Xây Nhà Gỗ (30🪵 300🪙)', {
        fontSize: '11px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }).setOrigin(0.5, 0.5);
      this.houseTooltip.add([ttBg, ttTxt]);

      this.houseSignSprite.setInteractive({ useHandCursor: true });
      this.houseSignSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.isInputBlocked || pointer.rightButtonDown()) return;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, houseCenterX, houseCenterY);
        if (dist <= this.INTERACTION_RANGE) {
          this.attemptBuildHouse();
        } else {
          this.handleTileClick(this.HOUSE_GRID_X, this.HOUSE_GRID_Y + 1);
        }
      });
    }

    // Render each constructed building
    for (const b of buildingsList) {
      const centerX = b.originX * this.TILE_SIZE + (b.width * this.TILE_SIZE) / 2;
      const centerY = b.originY * this.TILE_SIZE + (b.height * this.TILE_SIZE) / 2;
      const doorX = centerX;
      const doorY = (b.originY + b.height) * this.TILE_SIZE;

      let textureKey = 'farmer_house';
      let tooltipMsg = '🏡 [E] Vào Trong Nhà';
      let bodyW = 64;
      let bodyH = 48;
      let offY = 16;

      if (b.type === 'coop') {
        textureKey = 'building_coop';
        const chickenCount = (state.livestock || []).filter((a) => a.type === 'chicken').length;
        tooltipMsg = `🛖 Chuồng Gà (${chickenCount}/4 con)`;
        bodyW = 96;
        bodyH = 72;
        offY = 24;
      } else if (b.type === 'barn') {
        textureKey = 'building_barn';
        const cowCount = (state.livestock || []).filter((a) => a.type === 'cow').length;
        tooltipMsg = `🚜 Chuồng Bò (${cowCount}/3 con)`;
        bodyW = 96;
        bodyH = 72;
        offY = 24;
      }

      const sprite = this.physics.add.sprite(centerX, centerY, textureKey);
      sprite.setDepth(11);
      sprite.setImmovable(true);
      (sprite.body as Phaser.Physics.Arcade.Body).moves = false;
      sprite.body.setSize(bodyW, bodyH).setOffset(0, offY);
      this.solidObstacleGroup.add(sprite);

      const tooltip = this.add.container(doorX, doorY - 14);
      tooltip.setDepth(30).setVisible(false);
      const ttBg = this.add.graphics();
      ttBg.fillStyle(0x0f172a, 0.92);
      ttBg.lineStyle(1.5, b.type === 'house' ? 0x38bdf8 : 0xf59e0b, 0.9);
      ttBg.fillRoundedRect(-125, -13, 250, 26, 8);
      ttBg.strokeRoundedRect(-125, -13, 250, 26, 8);
      const ttTxt = this.add.text(0, 0, tooltipMsg, {
        fontSize: '11px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }).setOrigin(0.5, 0.5);
      tooltip.add([ttBg, ttTxt]);

      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.isInputBlocked || pointer.rightButtonDown()) return;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, doorX, doorY);
        if (dist <= this.INTERACTION_RANGE) {
          if (b.type === 'house') {
            this.enterHouseScene(b.originX, b.originY);
          } else if (b.type === 'coop') {
            useGameStore.getState().notify('🛖 Đây là Chuồng Gà. Đàn gà đang dạo chơi quanh chuồng!', 'info');
          } else if (b.type === 'barn') {
            useGameStore.getState().notify('🚜 Đây là Chuồng Bò. Đàn bò sữa đang gặm cỏ quanh chuồng!', 'info');
          }
        } else {
          this.handleTileClick(b.originX + Math.floor(b.width / 2), b.originY + b.height);
        }
      });

      this.buildingSprites.set(b.id, { sprite, tooltip });
    }
  }

  private updatePlacementGhost(
    pointer: Phaser.Input.Pointer,
    mode: { type: BuildingType; width: number; height: number; costWood: number; costStone: number; costGold: number }
  ) {
    if (!this.placementGhostGraphics) {
      this.placementGhostGraphics = this.add.graphics().setDepth(28);
    }
    if (!this.placementNoticeText) {
      this.placementNoticeText = this.add.text(0, 0, '', {
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#0f172a',
        strokeThickness: 3,
        fontFamily: 'system-ui, sans-serif'
      }).setOrigin(0.5, 1).setDepth(29);
    }

    this.placementGhostGraphics.clear();
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const gx = Math.floor(worldPoint.x / this.TILE_SIZE);
    const gy = Math.floor(worldPoint.y / this.TILE_SIZE);

    const isValid = this.isAreaValidForBuilding(gx, gy, mode.width, mode.height);
    const px = gx * this.TILE_SIZE;
    const py = gy * this.TILE_SIZE;
    const pw = mode.width * this.TILE_SIZE;
    const ph = mode.height * this.TILE_SIZE;

    const strokeColor = isValid ? 0x22c55e : 0xef4444;
    const fillColor = isValid ? 0x22c55e : 0xef4444;

    this.placementGhostGraphics.lineStyle(2, strokeColor, 0.9);
    this.placementGhostGraphics.fillStyle(fillColor, 0.3);
    this.placementGhostGraphics.strokeRect(px, py, pw, ph);
    this.placementGhostGraphics.fillRect(px, py, pw, ph);

    // Door indicator in bottom center
    const doorX = px + pw / 2 - 16;
    const doorY = py + ph - 8;
    this.placementGhostGraphics.fillStyle(0xfde047, 0.8);
    this.placementGhostGraphics.fillRect(doorX, doorY, 32, 8);

    this.placementNoticeText.setPosition(px + pw / 2, py - 6);
    this.placementNoticeText.setText(
      isValid
        ? `[Click để Đặt Móng - Esc/Phải để Hủy]`
        : `[Vị trí không hợp lệ - Vướng vật thể/ngoài biên]`
    );
    this.placementNoticeText.setColor(isValid ? '#4ade80' : '#f87171');
    this.placementNoticeText.setVisible(true);
  }

  private isAreaValidForBuilding(gx: number, gy: number, width: number, height: number): boolean {
    if (gx < 0 || gx + width > this.GRID_WIDTH || gy < 0 || gy + height > this.GRID_HEIGHT) {
      return false;
    }
    const store = useGameStore.getState();
    const currentBuildings = store.buildings || [];

    for (let x = gx; x < gx + width; x++) {
      for (let y = gy; y < gy + height; y++) {
        if ((x === this.SANCTUARY_GRID_X && y === this.SANCTUARY_GRID_Y) ||
            (x === this.BBQ_GRID_X && y === this.BBQ_GRID_Y)) {
          return false;
        }
        for (const b of currentBuildings) {
          if (x >= b.originX && x < b.originX + b.width && y >= b.originY && y < b.originY + b.height) {
            return false;
          }
        }
        const tile = store.tiles[`${x},${y}`];
        if (tile) {
          if (tile.crop || tile.obstacle || tile.placeable || tile.station) {
            return false;
          }
        }
      }
    }
    return true;
  }

  public syncStationsPositions(state = useGameStore.getState()) {
    const sanc = state.sanctuaryPosition ?? { x: 15, y: 3 };
    const bbq = state.bbqPosition ?? { x: 18, y: 3 };
    const moving = state.movingEntity;

    const isMovingCamp = moving?.type === 'station_campfire';
    const isMovingBbq = moving?.type === 'station_bbq';

    if (this.sanctuarySprite) {
      const campX = sanc.x * this.TILE_SIZE + 16;
      const campY = sanc.y * this.TILE_SIZE + 16;
      this.sanctuarySprite.setPosition(campX, campY);
      if (this.sanctuarySprite.body) {
        (this.sanctuarySprite.body as Phaser.Physics.Arcade.Body).reset(campX, campY);
      }
      this.sanctuarySprite.setVisible(!isMovingCamp);
    }
    if (this.sanctuaryTooltip) {
      const campX = sanc.x * this.TILE_SIZE + 16;
      const campY = sanc.y * this.TILE_SIZE + 16;
      this.sanctuaryTooltip.setPosition(campX, campY - 30);
      if (isMovingCamp) this.sanctuaryTooltip.setVisible(false);
    }

    if (this.bbqSprite) {
      const bbqX = bbq.x * this.TILE_SIZE + 16;
      const bbqY = bbq.y * this.TILE_SIZE + 16;
      this.bbqSprite.setPosition(bbqX, bbqY);
      if (this.bbqSprite.body) {
        (this.bbqSprite.body as Phaser.Physics.Arcade.Body).reset(bbqX, bbqY);
      }
      this.bbqSprite.setVisible(!isMovingBbq);
    }
    if (this.bbqTooltip) {
      const bbqX = bbq.x * this.TILE_SIZE + 16;
      const bbqY = bbq.y * this.TILE_SIZE + 16;
      this.bbqTooltip.setPosition(bbqX, bbqY - 30);
      if (isMovingBbq) this.bbqTooltip.setVisible(false);
    }
  }

  private createDustPuff(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      const offsetX = Phaser.Math.Between(-12, 12);
      const offsetY = Phaser.Math.Between(-6, 6);
      const p = this.add.image(x + offsetX, y + offsetY, 'fx_dust').setDepth(30).setScale(0.6);
      this.tweens.add({
        targets: p,
        alpha: { from: 1, to: 0 },
        y: y + offsetY - Phaser.Math.Between(8, 20),
        scale: { from: 0.6, to: 1.2 },
        duration: Phaser.Math.Between(350, 550),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  private updateRepositionGhost(pointer: Phaser.Input.Pointer, movingEntity: MovableEntityData | null) {
    if (!this.repositionGhostGraphics) {
      this.repositionGhostGraphics = this.add.graphics().setDepth(28);
    }
    if (!this.repositionNoticeText) {
      this.repositionNoticeText = this.add.text(0, 0, '', {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#0f172a',
        strokeThickness: 3,
        fontFamily: 'system-ui, sans-serif'
      }).setOrigin(0.5, 1).setDepth(29);
    }

    this.repositionGhostGraphics.clear();
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const gx = Math.floor(worldPoint.x / this.TILE_SIZE);
    const gy = Math.floor(worldPoint.y / this.TILE_SIZE);

    if (!this.isValidTile(gx, gy)) {
      this.repositionNoticeText.setVisible(false);
      if (this.repositionGhostSprite) this.repositionGhostSprite.setVisible(false);
      return;
    }

    if (movingEntity) {
      const w = movingEntity.width;
      const h = movingEntity.height;
      const px = gx * this.TILE_SIZE;
      const py = gy * this.TILE_SIZE;
      const pw = w * this.TILE_SIZE;
      const ph = h * this.TILE_SIZE;

      const isValid = this.isAreaValidForRelocation(gx, gy, w, h, movingEntity);
      const strokeColor = isValid ? 0x22c55e : 0xef4444;
      const fillColor = isValid ? 0x22c55e : 0xef4444;

      this.repositionGhostGraphics.lineStyle(2, strokeColor, 0.95);
      this.repositionGhostGraphics.fillStyle(fillColor, 0.25);
      this.repositionGhostGraphics.strokeRect(px, py, pw, ph);
      this.repositionGhostGraphics.fillRect(px, py, pw, ph);

      // Ghost sprite representation
      if (!this.repositionGhostSprite) {
        this.repositionGhostSprite = this.add.sprite(px + pw / 2, py + ph / 2, movingEntity.textureKey).setDepth(27).setAlpha(0.65);
      } else {
        this.repositionGhostSprite.setTexture(movingEntity.textureKey);
        this.repositionGhostSprite.setPosition(px + pw / 2, py + ph / 2);
        this.repositionGhostSprite.setVisible(true);
      }

      this.repositionNoticeText.setPosition(px + pw / 2, py - 6);
      this.repositionNoticeText.setText(
        isValid
          ? `[Click để Đặt ${movingEntity.name} - Esc/Phải để Hủy]`
          : `[Vị trí không hợp lệ - Bị vướng hoặc ra ngoài mép]`
      );
      this.repositionNoticeText.setColor(isValid ? '#4ade80' : '#f87171');
      this.repositionNoticeText.setVisible(true);
    } else {
      // Hovering in reposition mode: highlight movable object under cursor
      if (this.repositionGhostSprite) this.repositionGhostSprite.setVisible(false);

      const store = useGameStore.getState();
      const px = gx * this.TILE_SIZE;
      const py = gy * this.TILE_SIZE;

      const currentBuildings = store.buildings || [];
      const houseBuilding = currentBuildings.find((b) => b.type === 'house');
      const houseX = houseBuilding ? houseBuilding.originX : (store.houseOrigin?.x ?? 8);
      const houseY = houseBuilding ? houseBuilding.originY : (store.houseOrigin?.y ?? 2);
      const isHouse = gx >= houseX && gx < houseX + 2 && gy >= houseY && gy < houseY + 2;

      const sanc = store.sanctuaryPosition ?? { x: 15, y: 3 };
      const isSanc = gx === sanc.x && gy === sanc.y;

      const bbq = store.bbqPosition ?? { x: 18, y: 3 };
      const isBbq = gx === bbq.x && gy === bbq.y;

      const tile = store.tiles[`${gx},${gy}`];
      const hasCrop = Boolean(tile?.crop);
      const hasPlaceable = Boolean(tile?.placeable);
      const movableBld = currentBuildings.find(
        (b) => b.type !== 'house' && gx >= b.originX && gx < b.originX + b.width && gy >= b.originY && gy < b.originY + b.height
      );

      const isMovable = isSanc || isBbq || hasCrop || hasPlaceable || Boolean(movableBld);

      if (isHouse) {
        this.repositionGhostGraphics.lineStyle(2, 0xef4444, 0.9);
        this.repositionGhostGraphics.fillStyle(0xef4444, 0.2);
        this.repositionGhostGraphics.strokeRect(houseX * 32, houseY * 32, 64, 64);
        this.repositionGhostGraphics.fillRect(houseX * 32, houseY * 32, 64, 64);
        this.repositionNoticeText.setPosition(houseX * 32 + 32, houseY * 32 - 6);
        this.repositionNoticeText.setText('🔒 Nhà chính kiên cố, không thể di dời!');
        this.repositionNoticeText.setColor('#f87171');
        this.repositionNoticeText.setVisible(true);
      } else if (isMovable) {
        let name = 'Vật thể';
        let boxX = px;
        let boxY = py;
        let boxW = 32;
        let boxH = 32;

        if (isSanc) name = 'Bếp Lửa Trại 🔥';
        else if (isBbq) name = 'Quầy Nướng BBQ 🍖';
        else if (hasCrop) name = tile?.crop?.id === 'apple' ? 'Cây Táo 🍎' : 'Cây Trồng 🌱';
        else if (hasPlaceable) name = tile?.placeable?.type === 'chest' ? 'Rương Đồ 📦' : 'Hàng Rào 🪵';
        else if (movableBld) {
          name = movableBld.type === 'coop' ? 'Chuồng Gà 🛖' : 'Chuồng Bò 🚜';
          boxX = movableBld.originX * 32;
          boxY = movableBld.originY * 32;
          boxW = movableBld.width * 32;
          boxH = movableBld.height * 32;
        }

        this.repositionGhostGraphics.lineStyle(2, 0x38bdf8, 0.9);
        this.repositionGhostGraphics.fillStyle(0x38bdf8, 0.25);
        this.repositionGhostGraphics.strokeRect(boxX, boxY, boxW, boxH);
        this.repositionGhostGraphics.fillRect(boxX, boxY, boxW, boxH);
        this.repositionNoticeText.setPosition(boxX + boxW / 2, boxY - 6);
        this.repositionNoticeText.setText(`[Click để Nhấc ${name}]`);
        this.repositionNoticeText.setColor('#38bdf8');
        this.repositionNoticeText.setVisible(true);
      } else {
        this.repositionGhostGraphics.lineStyle(1.5, 0x94a3b8, 0.6);
        this.repositionGhostGraphics.strokeRect(px, py, 32, 32);
        this.repositionNoticeText.setVisible(false);
      }
    }
  }

  private isAreaValidForRelocation(gx: number, gy: number, w: number, h: number, movingEntity: MovableEntityData): boolean {
    if (gx < 0 || gx + w > this.GRID_WIDTH || gy < 0 || gy + h > this.GRID_HEIGHT) return false;

    // Check player proximity - player cannot be standing inside destination footprint
    const playerGx = Math.floor(this.player.x / this.TILE_SIZE);
    const playerGy = Math.floor(this.player.y / this.TILE_SIZE);
    if (playerGx >= gx && playerGx < gx + w && playerGy >= gy && playerGy < gy + h) {
      return false;
    }

    const store = useGameStore.getState();
    const currentBuildings = store.buildings || [];
    const houseBuilding = currentBuildings.find((b) => b.type === 'house');
    const houseX = houseBuilding ? houseBuilding.originX : (store.houseOrigin?.x ?? 8);
    const houseY = houseBuilding ? houseBuilding.originY : (store.houseOrigin?.y ?? 2);

    for (let x = gx; x < gx + w; x++) {
      for (let y = gy; y < gy + h; y++) {
        // Collide with house
        if (x >= houseX && x < houseX + 2 && y >= houseY && y < houseY + 2) return false;

        // Collide with other buildings
        for (const b of currentBuildings) {
          if (movingEntity.buildingData?.id === b.id) continue;
          if (x >= b.originX && x < b.originX + b.width && y >= b.originY && y < b.originY + b.height) {
            return false;
          }
        }

        // Collide with sanctuary
        const sanc = store.sanctuaryPosition ?? { x: 15, y: 3 };
        if (movingEntity.type !== 'station_campfire' && x === sanc.x && y === sanc.y) {
          return false;
        }

        // Collide with bbq
        const bbq = store.bbqPosition ?? { x: 18, y: 3 };
        if (movingEntity.type !== 'station_bbq' && x === bbq.x && y === bbq.y) {
          return false;
        }

        const tile = store.tiles[`${x},${y}`];
        if (tile) {
          if (tile.crop) return false;
          if (tile.placeable) return false;
          if (tile.obstacle && (tile.obstacle.type === 'rock' || tile.obstacle.type === 'wood')) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private syncLivestockSprites(livestockList: LivestockData[]) {
    const currentIds = new Set(livestockList.map((a) => a.id));

    for (const [id, entry] of this.livestockSprites.entries()) {
      if (!currentIds.has(id)) {
        entry.sprite.destroy();
        this.livestockSprites.delete(id);
      }
    }

    for (const animal of livestockList) {
      if (!this.livestockSprites.has(animal.id)) {
        const tex = animal.type === 'chicken' ? 'animal_chicken' : 'animal_cow';
        const sprite = this.physics.add.sprite(animal.x, animal.y, tex);
        sprite.setDepth(12);
        sprite.setCollideWorldBounds(true);
        if (animal.type === 'chicken') {
          sprite.body.setSize(18, 14).setOffset(7, 14);
        } else {
          sprite.body.setSize(24, 18).setOffset(4, 12);
        }
        this.physics.add.collider(sprite, this.solidObstacleGroup);

        sprite.setInteractive({ useHandCursor: true });
        sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (this.isInputBlocked || pointer.rightButtonDown()) return;
          if (animal.type === 'cow') {
            const currentCow = (useGameStore.getState().livestock || []).find((a) => a.id === animal.id);
            if (currentCow?.hasProductReady) {
              useGameStore.getState().milkCow(animal.id);
              this.showAnimalEmote(sprite, '🥛 +1 Sữa Tươi!', 1800);
            } else {
              useGameStore.getState().petAnimal(animal.id);
              this.showAnimalEmote(sprite, '❤️ Ùm bò...', 1500);
            }
          } else {
            useGameStore.getState().petAnimal(animal.id);
            this.showAnimalEmote(sprite, '❤️ Cục cục tác!', 1500);
          }
        });

        this.livestockSprites.set(animal.id, {
          sprite,
          data: animal,
          wanderTimer: Date.now() + Math.random() * 3000,
          targetX: animal.x,
          targetY: animal.y,
          isPeckingOrGrazing: false
        });
      }
    }
  }

  private syncDroppedEggs(eggs: EggEntityData[]) {
    const currentIds = new Set(eggs.map((e) => e.id));
    for (const [id, sprite] of this.eggSprites.entries()) {
      if (!currentIds.has(id)) {
        sprite.destroy();
        this.eggSprites.delete(id);
      }
    }

    for (const egg of eggs) {
      if (!this.eggSprites.has(egg.id)) {
        const sprite = this.physics.add.sprite(egg.x, egg.y, 'produce_egg');
        sprite.setDepth(10);
        sprite.setInteractive({ useHandCursor: true });
        sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (this.isInputBlocked || pointer.rightButtonDown()) return;
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, egg.x, egg.y);
          if (dist <= this.INTERACTION_RANGE) {
            useGameStore.getState().collectEgg(egg.id);
          } else {
            this.handleTileClick(Math.floor(egg.x / this.TILE_SIZE), Math.floor(egg.y / this.TILE_SIZE));
          }
        });

        this.eggSprites.set(egg.id, sprite);
      }
    }
  }

  private updateLivestockAI() {
    const now = Date.now();
    const store = useGameStore.getState();
    const buildingsList = store.buildings || [];

    // Stepping on eggs collects them automatically
    const eggs = store.droppedEggs || [];
    for (const egg of eggs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, egg.x, egg.y);
      if (dist <= 22) {
        store.collectEgg(egg.id);
        break;
      }
    }

    for (const [animalId, entry] of this.livestockSprites.entries()) {
      const sprite = entry.sprite;
      const animal = (store.livestock || []).find((a) => a.id === animalId);
      if (!animal) continue;

      // 1. Egg laying timer (for chickens)
      if (animal.type === 'chicken') {
        const lastProd = animal.lastProducedAt || now;
        if (now - lastProd >= 60000 && Math.random() < 0.05) {
          store.addDroppedEgg({
            id: `egg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            x: sprite.x + (Math.random() * 12 - 6),
            y: sprite.y + 4,
            createdAt: now
          });
          store.updateLivestockProduct(animalId, false);
          this.showAnimalEmote(sprite, '🥚 Cục tác!', 2000);
        }
      }

      // 2. Milk readiness timer (for cows)
      if (animal.type === 'cow' && !animal.hasProductReady) {
        const lastProd = animal.lastProducedAt || now;
        if (now - lastProd >= 75000) {
          store.updateLivestockProduct(animalId, true);
          this.showAnimalEmote(sprite, '🥛 Sẵn sàng vắt!', 2500);
        }
      }

      // 3. Wandering around home building
      if (now >= entry.wanderTimer) {
        const parentBuilding = buildingsList.find((b) => b.id === animal.buildingId);
        const homeX = parentBuilding ? (parentBuilding.originX + parentBuilding.width / 2) * this.TILE_SIZE : sprite.x;
        const homeY = parentBuilding ? (parentBuilding.originY + parentBuilding.height + 1) * this.TILE_SIZE : sprite.y;

        const angle = Math.random() * Math.PI * 2;
        const radius = 24 + Math.random() * 80;
        const rawTargetX = homeX + Math.cos(angle) * radius;
        const rawTargetY = homeY + Math.sin(angle) * radius;

        entry.targetX = Phaser.Math.Clamp(rawTargetX, 32, (this.GRID_WIDTH - 2) * this.TILE_SIZE);
        entry.targetY = Phaser.Math.Clamp(rawTargetY, 32, (this.GRID_HEIGHT - 2) * this.TILE_SIZE);
        entry.wanderTimer = now + 4000 + Math.random() * 5000;
        entry.isPeckingOrGrazing = false;
      }

      const dx = entry.targetX - sprite.x;
      const dy = entry.targetY - sprite.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        const speed = animal.type === 'chicken' ? 35 : 22;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;
        sprite.setVelocity(vx, vy);
        if (Math.abs(vx) > 2) {
          sprite.setFlipX(vx < 0);
        }
      } else {
        sprite.setVelocity(0, 0);
        if (!entry.isPeckingOrGrazing && Math.random() < 0.02) {
          entry.isPeckingOrGrazing = true;
          this.tweens.add({
            targets: sprite,
            scaleY: animal.type === 'chicken' ? 0.8 : 0.9,
            y: sprite.y + 2,
            duration: 250,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut'
          });
        }
      }
    }
  }

  private showAnimalEmote(target: Phaser.GameObjects.Sprite, text: string, duration = 1800) {
    const bubble = this.add.container(target.x, target.y - 20).setDepth(35);
    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.92);
    bg.lineStyle(1.5, 0xf59e0b, 0.9);
    bg.fillRoundedRect(-45, -10, 90, 20, 6);
    bg.strokeRoundedRect(-45, -10, 90, 20, 6);

    const txt = this.add.text(0, 0, text, {
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'system-ui, sans-serif'
    }).setOrigin(0.5, 0.5);

    bubble.add([bg, txt]);

    this.tweens.add({
      targets: bubble,
      y: target.y - 36,
      alpha: { from: 1, to: 0 },
      duration,
      onComplete: () => bubble.destroy()
    });
  }

  public enterHouseScene(houseOriginX = this.HOUSE_GRID_X, houseOriginY = this.HOUSE_GRID_Y) {
    this.cancelCurrentAction();
    this.stopMovement();
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
    }
    this.scene.start('HouseScene', {
      hasCustomAtlas: this.hasCustomAtlas,
      returnSpawnX: (houseOriginX + 1) * this.TILE_SIZE,
      returnSpawnY: (houseOriginY + 2) * this.TILE_SIZE + 18
    });
  }

  public attemptBuildHouse() {
    const res = useGameStore.getState().buildHouse();
    if (res.success) {
      this.renderAllBuildings();
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

  public openBBQStand() {
    this.cancelCurrentAction();
    this.stopMovement();
    if (this.player && this.player.body) {
      this.player.setVelocity(0, 0);
    }
    this.isPerformingAction = true;
    this.updateFacingDirection(this.bbqSprite.x, this.bbqSprite.y);
    this.game.events.emit('open-bbq-stand');
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
    this.currentPath = null;
    this.currentWaypointIndex = 0;
    this.queuedAction = null;
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

  update(_time: number, delta: number) {
    // 0. Update Animal Entity Systems (Companion Dog, Wild Boar & Livestock)
    this.updateDogAI(delta);
    this.updateBoarAI(delta);
    this.updateLivestockAI();

    // Key M toggles Reposition Mode
    if (this.mKey && Phaser.Input.Keyboard.JustDown(this.mKey)) {
      useGameStore.getState().toggleRepositionMode();
      this.repositionGhostGraphics?.clear();
      this.repositionNoticeText?.setVisible(false);
      this.repositionGhostSprite?.setVisible(false);
      this.syncStationsPositions();
    }

    // Cancel building placement mode or reposition mode if ESC key is pressed
    if (this.escKey && Phaser.Input.Keyboard.JustDown(this.escKey)) {
      const store = useGameStore.getState();
      if (store.movingEntity) {
        store.cancelRelocation();
        this.repositionGhostGraphics?.clear();
        this.repositionNoticeText?.setVisible(false);
        this.repositionGhostSprite?.setVisible(false);
        this.syncStationsPositions();
      } else if (store.isRepositionMode) {
        store.toggleRepositionMode(false);
        this.repositionGhostGraphics?.clear();
        this.repositionNoticeText?.setVisible(false);
        this.repositionGhostSprite?.setVisible(false);
      } else if (store.placementMode) {
        store.cancelPlacementMode();
        this.placementGhostGraphics?.clear();
        this.placementNoticeText?.setVisible(false);
      }
    }

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

    // Proximity check for BBQ Stand & 'E' key interaction
    if (this.bbqSprite && this.bbqTooltip) {
      const distToBBQ = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.bbqSprite.x,
        this.bbqSprite.y
      );
      const isNearBBQ = distToBBQ <= this.INTERACTION_RANGE;
      this.bbqTooltip.setVisible(isNearBBQ && !this.isInputBlocked);

      if (isNearBBQ && !this.isInputBlocked && !this.isPerformingAction && this.interactKey) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          this.openBBQStand();
          return;
        }
      }
    }

    // Proximity check for House Foundation Plot & 'E' key interaction
    if (this.houseTooltip) {
      const houseCenterX = (this.HOUSE_GRID_X + 1) * this.TILE_SIZE;
      const checkTargetY = (this.HOUSE_GRID_Y + 1) * this.TILE_SIZE;
      const distToHouse = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        houseCenterX,
        checkTargetY
      );
      const isNearHouse = distToHouse <= this.INTERACTION_RANGE;
      this.houseTooltip.setVisible(isNearHouse && !this.isInputBlocked);

      if (isNearHouse && !this.isInputBlocked && !this.isPerformingAction && this.interactKey) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          this.attemptBuildHouse();
          return;
        }
      }
    }

    // Proximity check for all constructed Farm Buildings (House, Coop, Barn)
    for (const [bId, entry] of this.buildingSprites.entries()) {
      const b = (useGameStore.getState().buildings || []).find((x) => x.id === bId);
      if (!b || !entry.tooltip) continue;

      const doorX = b.originX * this.TILE_SIZE + (b.width * this.TILE_SIZE) / 2;
      const doorY = (b.originY + b.height) * this.TILE_SIZE;
      const distToDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, doorX, doorY);
      const isNear = distToDoor <= this.INTERACTION_RANGE;

      entry.tooltip.setVisible(isNear && !this.isInputBlocked);

      if (isNear && !this.isInputBlocked && !this.isPerformingAction && this.interactKey) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          if (b.type === 'house') {
            this.enterHouseScene(b.originX, b.originY);
            return;
          } else if (b.type === 'coop') {
            useGameStore.getState().notify('🛖 Đây là Chuồng Gà. Đàn gà đang đẻ trứng quanh chuồng!', 'info');
            return;
          } else if (b.type === 'barn') {
            useGameStore.getState().notify('🚜 Đây là Chuồng Bò. Đàn bò sữa đang gặm cỏ quanh chuồng!', 'info');
            return;
          }
        }
      }
    }

    // Proximity check for Livestock (Chicken / Cow) & 'E' key interaction (Petting or Milking)
    if (!this.isInputBlocked && !this.isPerformingAction && this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      let nearestAnimal: { id: string; sprite: Phaser.GameObjects.Sprite; dist: number } | null = null;
      for (const [aId, entry] of this.livestockSprites.entries()) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, entry.sprite.x, entry.sprite.y);
        if (dist <= this.INTERACTION_RANGE) {
          if (!nearestAnimal || dist < nearestAnimal.dist) {
            nearestAnimal = { id: aId, sprite: entry.sprite, dist };
          }
        }
      }

      if (nearestAnimal) {
        const store = useGameStore.getState();
        const animal = (store.livestock || []).find((a) => a.id === nearestAnimal!.id);
        if (animal) {
          if (animal.type === 'cow' && animal.hasProductReady) {
            store.milkCow(animal.id);
            this.showAnimalEmote(nearestAnimal.sprite, '🥛 +1 Sữa Tươi!', 1800);
          } else {
            store.petAnimal(animal.id);
            const emoteText = animal.type === 'cow' ? '❤️ Ùm bò...' : '❤️ Cục cục tác!';
            this.showAnimalEmote(nearestAnimal.sprite, emoteText, 1500);
          }
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

    // 1. Player Override: Manual keyboard control immediately cancels any automated pathfinding
    if (manualVx !== 0 || manualVy !== 0) {
      this.currentPath = null;
      this.currentWaypointIndex = 0;
      this.queuedAction = null;

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

    // 2. Tile-by-Tile A* Waypoint Traversal Loop
    if (this.currentPath && this.currentPath.length > 0) {
      const wp = this.currentPath[this.currentWaypointIndex];
      const dx = wp.wx - this.player.x;
      const dy = wp.wy - this.player.y;
      const dist = Math.hypot(dx, dy);

      // Reached current waypoint center (tolerance <= 3px)
      if (dist <= 3) {
        this.player.setPosition(wp.wx, wp.wy);
        this.currentWaypointIndex++;

        // Reached final destination of path
        if (this.currentWaypointIndex >= this.currentPath.length) {
          const action = this.queuedAction;
          this.currentPath = null;
          this.currentWaypointIndex = 0;
          this.queuedAction = null;
          this.player.setVelocity(0, 0);

          if (action) {
            const targetCenterX = action.targetGridX * this.TILE_SIZE + 16;
            const targetCenterY = action.targetGridY * this.TILE_SIZE + 16;
            this.updateFacingDirection(targetCenterX, targetCenterY);

            const buildingsList = useGameStore.getState().buildings || [];
            const arrivedBuilding = buildingsList.find((b) =>
              action.targetGridX >= b.originX && action.targetGridX < b.originX + b.width &&
              action.targetGridY >= b.originY && action.targetGridY < b.originY + b.height
            );

            if (arrivedBuilding) {
              if (arrivedBuilding.type === 'house') {
                this.enterHouseScene(arrivedBuilding.originX, arrivedBuilding.originY);
              } else if (arrivedBuilding.type === 'coop') {
                useGameStore.getState().notify('🛖 Bạn đã đến trước Chuồng Gà!', 'info');
              } else if (arrivedBuilding.type === 'barn') {
                useGameStore.getState().notify('🚜 Bạn đã đến trước Chuồng Bò!', 'info');
              }
            } else if (action.targetGridX === this.SANCTUARY_GRID_X && action.targetGridY === this.SANCTUARY_GRID_Y) {
              this.openSanctuaryQuiz();
            } else if (action.targetGridX === this.BBQ_GRID_X && action.targetGridY === this.BBQ_GRID_Y) {
              this.openBBQStand();
            } else if (
              (action.targetGridX === this.HOUSE_GRID_X || action.targetGridX === this.HOUSE_GRID_X + 1) &&
              (action.targetGridY === this.HOUSE_GRID_Y || action.targetGridY === this.HOUSE_GRID_Y + 1)
            ) {
              if (useGameStore.getState().hasHouse) {
                this.enterHouseScene();
              } else {
                this.attemptBuildHouse();
              }
            } else {
              this.triggerTileInteraction(action.targetGridX, action.targetGridY);
            }
          } else {
            this.updatePlayerIdleAnimation();
          }
          return;
        }
      } else {
        // Move strictly along dominant cardinal direction to prevent diagonal obstacle clipping
        let vx = 0;
        let vy = 0;

        if (Math.abs(dx) > Math.abs(dy)) {
          vx = Math.sign(dx) * this.playerSpeed;
          // Align cross axis if close to avoid collider edge scraping
          if (Math.abs(dy) <= 6) {
            this.player.y = wp.wy;
          }
        } else {
          vy = Math.sign(dy) * this.playerSpeed;
          // Align cross axis if close to avoid collider edge scraping
          if (Math.abs(dx) <= 6) {
            this.player.x = wp.wx;
          }
        }

        this.player.setVelocity(vx, vy);

        if (vx < 0) this.lastDirection = 'left';
        else if (vx > 0) this.lastDirection = 'right';
        else if (vy < 0) this.lastDirection = 'up';
        else if (vy > 0) this.lastDirection = 'down';

        this.player.setDepth(10 + (this.player.y / 1000));
        const walkAnim = `walk_${this.lastDirection}`;
        if (this.anims.exists(walkAnim)) {
          this.player.anims.play(walkAnim, true);
        }
        return;
      }
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

  public isTileWalkable(gx: number, gy: number): boolean {
    if (gx < 0 || gx >= this.GRID_WIDTH || gy < 0 || gy >= this.GRID_HEIGHT) {
      return false;
    }

    // Permanent rest stations are solid
    if ((gx === this.SANCTUARY_GRID_X && gy === this.SANCTUARY_GRID_Y) ||
        (gx === this.BBQ_GRID_X && gy === this.BBQ_GRID_Y)) {
      return false;
    }

    const store = useGameStore.getState();
    const buildingsList = store.buildings || [];
    for (const b of buildingsList) {
      if (gx >= b.originX && gx < b.originX + b.width && gy >= b.originY && gy < b.originY + b.height) {
        return false;
      }
    }

    // Default House foundation footprint (8,2) to (9,3) is solid if no house constructed yet
    if (!store.hasHouse && !buildingsList.some((b) => b.type === 'house')) {
      if (gx >= this.HOUSE_GRID_X && gx <= this.HOUSE_GRID_X + 1 &&
          gy >= this.HOUSE_GRID_Y && gy <= this.HOUSE_GRID_Y + 1) {
        return false;
      }
    }
    const tile = store.tiles[`${gx},${gy}`];
    if (!tile) return true;

    if (tile.station) return false;

    // Solid obstacles (Rock, Wood) - Weeds are walkable
    if (tile.obstacle) {
      if (tile.obstacle.type === 'rock' || tile.obstacle.type === 'wood' || tile.obstacle.isDestructible === false) {
        return false;
      }
    }

    // Solid structures (Fence, Chest)
    if (tile.placeable) {
      if (tile.placeable.type === 'fence' || tile.placeable.type === 'chest') {
        return false;
      }
    }

    return true;
  }

  private startPathNavigation(
    waypoints: { x: number; y: number }[], 
    targetGridX: number, 
    targetGridY: number,
    queueAction = true
  ) {
    this.currentPath = waypoints.map((pt) => ({
      gx: pt.x,
      gy: pt.y,
      wx: pt.x * this.TILE_SIZE + 16,
      wy: pt.y * this.TILE_SIZE + 16
    }));
    this.currentWaypointIndex = 0;
    this.queuedAction = queueAction ? { targetGridX, targetGridY } : null;
  }

  private showFloatingNotice(text: string, x?: number, y?: number) {
    const posX = x ?? this.player.x;
    const posY = y ?? (this.player.y - 20);

    const notice = this.add.text(posX, posY, text, {
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#f87171',
      stroke: '#0f172a',
      strokeThickness: 3,
      fontFamily: 'sans-serif'
    }).setOrigin(0.5).setDepth(40);

    this.tweens.add({
      targets: notice,
      y: posY - 22,
      alpha: 0,
      duration: 1200,
      ease: 'Power1',
      onComplete: () => notice.destroy()
    });
  }

  private handleTileClick(x: number, y: number) {
    const store = useGameStore.getState();

    // 0. Stone Throwing Minigame with Companion Dog
    if (store.activeTool === 'resource_stone') {
      this.throwStoneToTile(x, y);
      return;
    }

    const isMoveOnly = store.activeTool === 'none';
    const isSanctuary = x === this.SANCTUARY_GRID_X && y === this.SANCTUARY_GRID_Y;
    const isBBQ = x === this.BBQ_GRID_X && y === this.BBQ_GRID_Y;
    const isHouse = (x === this.HOUSE_GRID_X || x === this.HOUSE_GRID_X + 1) &&
                    (y === this.HOUSE_GRID_Y || y === this.HOUSE_GRID_Y + 1);

    const buildingsList = store.buildings || [];
    const clickedBuilding = buildingsList.find((b) =>
      x >= b.originX && x < b.originX + b.width && y >= b.originY && y < b.originY + b.height
    );

    // 1. Direct Click on Campfire Sanctuary
    if (isSanctuary) {
      const distToCamp = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sanctuarySprite.x, this.sanctuarySprite.y);
      if (distToCamp <= this.INTERACTION_RANGE) {
        this.openSanctuaryQuiz();
        return;
      }
    }

    // 2. Direct Click on BBQ Stand
    if (isBBQ) {
      const distToBBQ = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bbqSprite.x, this.bbqSprite.y);
      if (distToBBQ <= this.INTERACTION_RANGE) {
        this.openBBQStand();
        return;
      }
    }

    // 3. Direct Click on Constructed Buildings
    if (clickedBuilding) {
      const doorX = (clickedBuilding.originX + clickedBuilding.width / 2) * this.TILE_SIZE;
      const doorY = (clickedBuilding.originY + clickedBuilding.height) * this.TILE_SIZE;
      const distToBld = Phaser.Math.Distance.Between(this.player.x, this.player.y, doorX, doorY);
      if (distToBld <= this.INTERACTION_RANGE) {
        if (clickedBuilding.type === 'house') {
          this.enterHouseScene(clickedBuilding.originX, clickedBuilding.originY);
        } else if (clickedBuilding.type === 'coop') {
          store.notify('🛖 Đây là Chuồng Gà. Đàn gà đang đẻ trứng quanh chuồng!', 'info');
        } else if (clickedBuilding.type === 'barn') {
          store.notify('🚜 Đây là Chuồng Bò. Đàn bò sữa đang gặm cỏ quanh chuồng!', 'info');
        }
        return;
      }
    }

    // 4. Direct Click on Default House Plot Signboard
    if (isHouse && !clickedBuilding) {
      const houseDoorX = (this.HOUSE_GRID_X + 1) * this.TILE_SIZE;
      const houseDoorY = (this.HOUSE_GRID_Y + 2) * this.TILE_SIZE;
      const distToHouse = Phaser.Math.Distance.Between(this.player.x, this.player.y, houseDoorX, houseDoorY);
      if (distToHouse <= this.INTERACTION_RANGE) {
        if (store.hasHouse) {
          this.enterHouseScene();
        } else {
          this.attemptBuildHouse();
        }
        return;
      }
    }

    const targetCenterX = x * this.TILE_SIZE + 16;
    const targetCenterY = y * this.TILE_SIZE + 16;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetCenterX, targetCenterY);

    // Case 1: Within interaction range (dist <= INTERACTION_RANGE)
    if (dist <= this.INTERACTION_RANGE) {
      if (isSanctuary) {
        this.openSanctuaryQuiz();
        return;
      }
      if (isBBQ) {
        this.openBBQStand();
        return;
      }
      if (clickedBuilding) {
        if (clickedBuilding.type === 'house') {
          this.enterHouseScene(clickedBuilding.originX, clickedBuilding.originY);
        } else if (clickedBuilding.type === 'coop') {
          store.notify('🛖 Đây là Chuồng Gà. Đàn gà đang đẻ trứng quanh chuồng!', 'info');
        } else if (clickedBuilding.type === 'barn') {
          store.notify('🚜 Đây là Chuồng Bò. Đàn bò sữa đang gặm cỏ quanh chuồng!', 'info');
        }
        return;
      }
      if (isHouse) {
        if (store.hasHouse) {
          this.enterHouseScene();
        } else {
          this.attemptBuildHouse();
        }
        return;
      }
      if (isMoveOnly) {
        // Move-Only Mode: strictly only walk to destination tile, do NOT execute tool actions!
        if (this.isTileWalkable(x, y)) {
          this.startPathNavigation([{ x, y }], x, y, false);
        } else {
          this.stopMovement();
          this.updateFacingDirection(targetCenterX, targetCenterY);
        }
        return;
      }

      this.stopMovement();
      this.updateFacingDirection(targetCenterX, targetCenterY);
      this.triggerTileInteraction(x, y);
      return;
    }

    // Case 2: Out of range -> Calculate tile-by-tile A* path
    const startGx = Phaser.Math.Clamp(Math.floor(this.player.x / this.TILE_SIZE), 0, this.GRID_WIDTH - 1);
    const startGy = Phaser.Math.Clamp(Math.floor(this.player.y / this.TILE_SIZE), 0, this.GRID_HEIGHT - 1);

    const isSolid = !this.isTileWalkable(x, y);
    const shouldQueueAction = !isMoveOnly || isSanctuary || isBBQ || isHouse || Boolean(clickedBuilding);

    if (isSolid) {
      // Find shortest valid path to any walkable adjacent neighbor of solid entity/station
      const result = findBestAdjacentPath(
        { x: startGx, y: startGy },
        { x, y },
        (gx, gy) => this.isTileWalkable(gx, gy),
        this.GRID_WIDTH,
        this.GRID_HEIGHT
      );

      if (!result) {
        this.showFloatingNotice('Không có đường đi tới đó!', targetCenterX, targetCenterY);
        return;
      }

      if (result.path.length === 0) {
        // Player is already standing on an adjacent tile
        this.stopMovement();
        this.updateFacingDirection(targetCenterX, targetCenterY);
        if (isSanctuary) {
          this.openSanctuaryQuiz();
        } else if (isBBQ) {
          this.openBBQStand();
        } else if (clickedBuilding) {
          if (clickedBuilding.type === 'house') {
            this.enterHouseScene(clickedBuilding.originX, clickedBuilding.originY);
          } else if (clickedBuilding.type === 'coop') {
            store.notify('🛖 Bạn đã đến trước Chuồng Gà!', 'info');
          } else if (clickedBuilding.type === 'barn') {
            store.notify('🚜 Bạn đã đến trước Chuồng Bò!', 'info');
          }
        } else if (isHouse) {
          if (store.hasHouse) {
            this.enterHouseScene();
          } else {
            this.attemptBuildHouse();
          }
        } else if (!isMoveOnly) {
          this.triggerTileInteraction(x, y);
        }
        return;
      }

      this.startPathNavigation(result.path, x, y, shouldQueueAction);
    } else {
      // Walkable target: find direct A* path
      const path = findAStarPath(
        { x: startGx, y: startGy },
        { x, y },
        (gx, gy) => this.isTileWalkable(gx, gy),
        this.GRID_WIDTH,
        this.GRID_HEIGHT
      );

      if (!path) {
        this.showFloatingNotice('Không có đường đi tới đó!', targetCenterX, targetCenterY);
        return;
      }

      if (path.length === 0) {
        this.stopMovement();
        this.updateFacingDirection(targetCenterX, targetCenterY);
        if (!isMoveOnly) {
          this.triggerTileInteraction(x, y);
        }
        return;
      }

      this.startPathNavigation(path, x, y, shouldQueueAction);
    }
  }

  /**
    * Evaluates the tile target and triggers appropriate animation or immediate action
    */
  private triggerTileInteraction(x: number, y: number) {
    // Interacting with indestructible rest stations
    if (x === this.SANCTUARY_GRID_X && y === this.SANCTUARY_GRID_Y) {
      this.openSanctuaryQuiz();
      return;
    }
    if (x === this.BBQ_GRID_X && y === this.BBQ_GRID_Y) {
      this.openBBQStand();
      return;
    }

    const store = useGameStore.getState();
    const activeTool = store.activeTool;
    if (activeTool === 'none') {
      // Move-Only mode: strictly no tile interaction
      return;
    }

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
      // Direct action for placing items, fertilizer, seed planting, etc.
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

    // Priority -1: Move-Only / Observation Mode
    if (activeTool === 'none') {
      return;
    }

    // Priority -0.5: Stone Throw Fetch Minigame
    if (activeTool === 'resource_stone') {
      this.throwStoneToTile(x, y);
      return;
    }

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

    // Priority 0.9: Special Crop Clearing Actions (Withered Crop or Apple Tree Chop)
    if (currentTile?.crop) {
      // Scythe or Hoe on Withered Crop
      if (currentTile.crop.isWithered && (activeTool === 'scythe' || activeTool === 'hoe')) {
        const res = store.gatherResource(x, y);
        if (res.success) {
          this.showFloatingText(x, y, '+1 Sợi Cỏ Dại 🌾 (-1 Năng lượng)', '#a3e635');
        } else {
          this.showFloatingText(x, y, res.reason || 'Không thể dọn dẹp!', '#fb7185', true);
        }
        return;
      }

      // Axe Chop on Apple Tree (Stage 2 or Stage 3)
      if (currentTile.crop.id === 'apple' && activeTool === 'axe') {
        const res = store.gatherResource(x, y);
        if (res.success) {
          this.showFloatingText(x, y, '+6 Gỗ Tự Nhiên 🪵 (-3 Năng lượng)', '#facc15');
        } else {
          this.showFloatingText(x, y, res.reason || 'Không thể chặt cây!', '#fb7185', true);
        }
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
    } else if (activeTool.startsWith('seed_') || activeTool === 'seed') {
      const targetSeed = activeTool === 'seed' ? (store.activeSeedId || 'seed_wheat') : activeTool;
      const tileBefore = store.tiles[`${x},${y}`];
      const res = store.plantCrop(x, y, targetSeed);
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
        this.showFloatingText(x, y, `+ ${res.cropName} (+${res.goldReward} Gold)`, '#fbbf24');
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
        const cropTexture = tile.crop.isWithered
          ? 'crop_withered'
          : `crop_${tile.crop.id}_${growth.currentStage}`;

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
        const cropTexture = tile.crop.isWithered
          ? 'crop_withered'
          : `crop_${tile.crop.id}_${growth.currentStage}`;

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

          if (tile.crop.isWithered) {
            entry.cropSprite.clearTint();
          } else if (growth.isRipe && entry.cropSprite.tintTopLeft === 0xffffff) {
            // Subtle ripe visual tint indicator when ready for harvest
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

  /**
   * Fetch Stone Minigame: Player throws a pebble towards target grid tile,
   * dog chases and retrieves it to reward +1 Stone, +5 XP, +5 Energy!
   */
  private throwStoneToTile(gx: number, gy: number) {
    if (this.currentThrownStone) return; // Stone already in flight or being retrieved

    const store = useGameStore.getState();
    const res = store.throwStone();
    if (!res.success) {
      this.showFloatingNotice('Không còn đá trong túi đồ!');
      return;
    }

    const targetWx = gx * this.TILE_SIZE + 16;
    const targetWy = gy * this.TILE_SIZE + 16;

    this.updateFacingDirection(targetWx, targetWy);

    // Spawn stone projectile
    const stone = this.add.sprite(this.player.x, this.player.y - 10, 'item_stone_thrown');
    stone.setDepth(25);
    this.currentThrownStone = stone;

    // Small throw recoil on player
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 4,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    });

    const flightDuration = Math.min(800, Math.max(350, Phaser.Math.Distance.Between(this.player.x, this.player.y, targetWx, targetWy) * 2.2));

    this.tweens.add({
      targets: stone,
      x: targetWx,
      duration: flightDuration,
      ease: 'Linear'
    });

    this.tweens.add({
      targets: stone,
      y: targetWy - 36,
      duration: flightDuration / 2,
      ease: 'Quad.easeOut',
      yoyo: true,
      onComplete: () => {
        stone.y = targetWy;
        this.spawnImpactParticles(targetWx, targetWy, 'fx_dust');
        this.startDogFetch(targetWx, targetWy);
      }
    });
  }

  private startDogFetch(targetWx: number, targetWy: number) {
    this.fetchStoneTarget = { x: targetWx, y: targetWy };
    this.dogState = 'fetch';
    this.dog.setTexture('companion_dog');
    this.showDogEmote('Gâu! 🐾', 1200);
  }

  private showDogEmote(text: string, durationMs = 1500) {
    this.dogEmoteText.setText(text);
    this.dogStoneIcon.setVisible(false);
    this.dogEmoteContainer.setVisible(true);

    this.time.delayedCall(durationMs, () => {
      if (this.dogState !== 'return_stone') {
        this.dogEmoteContainer.setVisible(false);
      }
    });
  }

  /**
   * Companion Pet Dog AI State Machine:
   * Handles Leash wandering, player following, fetching thrown stones, and barking to scare boars
   */
  private updateDogAI(delta: number) {
    if (!this.dog || !this.dog.body) return;

    if (this.dogEmoteContainer) {
      this.dogEmoteContainer.setPosition(this.dog.x, this.dog.y - 20);
    }
    this.dog.setDepth(10 + (this.dog.y / 1000));

    // 1. Fetch State (Chasing the thrown stone)
    if (this.dogState === 'fetch') {
      if (!this.fetchStoneTarget) {
        this.dogState = 'idle';
        return;
      }

      const dx = this.fetchStoneTarget.x - this.dog.x;
      const dy = this.fetchStoneTarget.y - this.dog.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= 12) {
        this.dog.setVelocity(0, 0);
        if (this.currentThrownStone) {
          this.currentThrownStone.destroy();
          this.currentThrownStone = null;
        }
        this.fetchStoneTarget = null;
        this.dogState = 'return_stone';
        // Show stone in mouth
        this.dogEmoteText.setText('');
        this.dogStoneIcon.setVisible(true);
        this.dogEmoteContainer.setVisible(true);
      } else {
        const speed = 180;
        this.dog.setVelocity((dx / dist) * speed, (dy / dist) * speed);
        this.dog.setFlipX(dx < 0);
      }
      return;
    }

    // 2. Return Stone State (Delivering fetched stone back to player)
    if (this.dogState === 'return_stone') {
      const dx = this.player.x - this.dog.x;
      const dy = this.player.y - this.dog.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= 28) {
        this.dog.setVelocity(0, 0);
        this.dogStoneIcon.setVisible(false);
        this.dogState = 'idle';
        this.dogWanderTimer = 2000;
        this.dogSitTimer = 0;

        useGameStore.getState().returnFetchedStone();
        this.showDogEmote('❤️ Gâu!', 2200);
        this.showFloatingText(
          Math.floor(this.dog.x / this.TILE_SIZE),
          Math.floor(this.dog.y / this.TILE_SIZE),
          '+1 Đá Cuội 🪨 (+5 XP, +5 Năng lượng)',
          '#4ade80'
        );
      } else {
        const speed = 175;
        this.dog.setVelocity((dx / dist) * speed, (dy / dist) * speed);
        this.dog.setFlipX(dx < 0);
      }
      return;
    }

    // 3. Chase Wild Boar State (Defending the crops)
    if (this.dogState === 'chase_boar') {
      if (!this.wildBoar || this.boarState === 'fleeing') {
        this.dogState = 'follow';
        return;
      }

      const dx = this.wildBoar.x - this.dog.x;
      const dy = this.wildBoar.y - this.dog.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= 50) {
        this.showDogEmote('Gâu gâu! 🐕🔊', 1500);
        this.scareWildBoar();
        this.dogState = 'follow';
        this.dog.setVelocity(0, 0);
      } else {
        const speed = 165;
        this.dog.setVelocity((dx / dist) * speed, (dy / dist) * speed);
        this.dog.setFlipX(dx < 0);
      }
      return;
    }

    // 4. Default Follow / Leash / Wander / Sit AI
    const distToPlayer = Phaser.Math.Distance.Between(this.dog.x, this.dog.y, this.player.x, this.player.y);

    // If wild boar appeared within 160px of dog, dog automatically protects the farm!
    if (this.wildBoar && this.boarState !== 'fleeing') {
      const distToBoar = Phaser.Math.Distance.Between(this.dog.x, this.dog.y, this.wildBoar.x, this.wildBoar.y);
      if (distToBoar <= 160) {
        this.dogState = 'chase_boar';
        this.dog.setTexture('companion_dog');
        this.showDogEmote('Gâu! ⚠️', 1000);
        return;
      }
    }

    if (distToPlayer > 96) {
      // Follow: Player moved far away (> 96px) -> run towards player
      this.dog.setTexture('companion_dog');
      const dx = this.player.x - this.dog.x;
      const dy = this.player.y - this.dog.y;
      const dist = Math.hypot(dx, dy);
      const speed = 135;
      this.dog.setVelocity((dx / dist) * speed, (dy / dist) * speed);
      this.dog.setFlipX(dx < 0);
      this.dogState = 'follow';
      this.dogSitTimer = 0;
    } else if (distToPlayer > 44) {
      // Leash range (44 - 96px): Trot gently around player
      this.dogWanderTimer -= delta;
      if (this.dogWanderTimer <= 0) {
        this.dogWanderTimer = Phaser.Math.Between(1600, 3200);
        const angle = Math.random() * Math.PI * 2;
        const radius = Phaser.Math.Between(34, 56);
        this.dogTargetX = this.player.x + Math.cos(angle) * radius;
        this.dogTargetY = this.player.y + Math.sin(angle) * radius;
      }

      const dx = this.dogTargetX - this.dog.x;
      const dy = this.dogTargetY - this.dog.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 8) {
        this.dog.setTexture('companion_dog');
        this.dog.setVelocity((dx / dist) * 65, (dy / dist) * 65);
        this.dog.setFlipX(dx < 0);
      } else {
        this.dog.setVelocity(0, 0);
      }
      this.dogSitTimer = 0;
    } else {
      // Very close to player (dist <= 44): Stop and Sit
      this.dog.setVelocity(0, 0);
      this.dogSitTimer += delta;
      if (this.dogSitTimer > 2500) {
        this.dog.setTexture('companion_dog_sit');
      } else {
        this.dog.setTexture('companion_dog');
      }
    }
  }

  /**
   * Wild Boar Pest AI System:
   * Periodic 60s spawn loop targeting nearest crops, eating for 5s, and fleeing when chased
   */
  private trySpawnWildBoar() {
    if (Date.now() < this.boarCooldownUntil) return;
    if (this.wildBoar) return; // Only 1 active boar at a time

    const store = useGameStore.getState();
    const activeCrops: Array<{ gx: number; gy: number }> = [];

    for (const [key, tile] of Object.entries(store.tiles)) {
      if (tile.crop && !tile.crop.isWithered) {
        const [gx, gy] = key.split(',').map(Number);
        activeCrops.push({ gx, gy });
      }
    }

    if (activeCrops.length === 0) return; // No crops to target

    // Spawn from random edge outside grid
    const edge = Math.floor(Math.random() * 4);
    let sx = 0;
    let sy = 0;

    if (edge === 0) {
      sx = -16;
      sy = Phaser.Math.Between(64, this.GRID_HEIGHT * this.TILE_SIZE - 64);
    } else if (edge === 1) {
      sx = this.GRID_WIDTH * this.TILE_SIZE + 16;
      sy = Phaser.Math.Between(64, this.GRID_HEIGHT * this.TILE_SIZE - 64);
    } else if (edge === 2) {
      sx = Phaser.Math.Between(64, this.GRID_WIDTH * this.TILE_SIZE - 64);
      sy = -16;
    } else {
      sx = Phaser.Math.Between(64, this.GRID_WIDTH * this.TILE_SIZE - 64);
      sy = this.GRID_HEIGHT * this.TILE_SIZE + 16;
    }

    this.wildBoar = this.physics.add.sprite(sx, sy, 'wild_boar');
    this.wildBoar.setDepth(14);
    this.wildBoar.body.setSize(24, 16).setOffset(4, 10);
    this.physics.add.collider(this.wildBoar, this.solidObstacleGroup);

    // Find closest crop to spawn point
    let nearestCrop = activeCrops[0];
    let minDist = Infinity;
    for (const c of activeCrops) {
      const d = Math.hypot(c.gx * this.TILE_SIZE + 16 - sx, c.gy * this.TILE_SIZE + 16 - sy);
      if (d < minDist) {
        minDist = d;
        nearestCrop = c;
      }
    }

    this.boarTargetGrid = { x: nearestCrop.gx, y: nearestCrop.gy };
    this.boarState = 'running_to_crop';

    // Notify user with warning banner
    useGameStore.getState().notify('⚠️ Cảnh báo: Heo rừng đang tiến vào ăn trộm mùa màng!', 'warning');
  }

  private updateBoarAI(_delta: number) {
    if (!this.wildBoar || !this.wildBoar.body) return;

    this.wildBoar.setDepth(10 + (this.wildBoar.y / 1000));

    // Player or Dog proximity triggers immediate flee!
    const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.wildBoar.x, this.wildBoar.y);
    const distToDog = Phaser.Math.Distance.Between(this.dog.x, this.dog.y, this.wildBoar.x, this.wildBoar.y);

    if (this.boarState !== 'fleeing' && (distToPlayer <= 48 || distToDog <= 55)) {
      this.scareWildBoar();
      return;
    }

    // State 1: Running to Crop
    if (this.boarState === 'running_to_crop') {
      if (!this.boarTargetGrid) {
        this.scareWildBoar();
        return;
      }

      const store = useGameStore.getState();
      const targetTile = store.tiles[`${this.boarTargetGrid.x},${this.boarTargetGrid.y}`];
      if (!targetTile?.crop) {
        this.scareWildBoar();
        return;
      }

      const targetWx = this.boarTargetGrid.x * this.TILE_SIZE + 16;
      const targetWy = this.boarTargetGrid.y * this.TILE_SIZE + 16;

      const dx = targetWx - this.wildBoar.x;
      const dy = targetWy - this.wildBoar.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= 10) {
        // Arrived at crop, start eating (5 seconds)
        this.wildBoar.setVelocity(0, 0);
        this.boarState = 'eating';
        this.showFloatingNotice('Heo rừng đang ăn trộm cây... (5s)', this.wildBoar.x, this.wildBoar.y - 14);

        this.boarEatingTween = this.tweens.add({
          targets: this.wildBoar,
          scaleY: { from: 1, to: 0.8 },
          duration: 250,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        const targetGrid = { ...this.boarTargetGrid };
        this.boarEatingTimer = this.time.delayedCall(5000, () => {
          if (this.boarState === 'eating' && this.wildBoar) {
            store.destroyCropByPest(targetGrid.x, targetGrid.y);
            this.scareWildBoar();
          }
        });
      } else {
        const speed = 85;
        this.wildBoar.setVelocity((dx / dist) * speed, (dy / dist) * speed);
        this.wildBoar.setFlipX(dx > 0);
      }
      return;
    }

    // State 2: Eating (holding position during eating timer)
    if (this.boarState === 'eating') {
      this.wildBoar.setVelocity(0, 0);
      return;
    }

    // State 3: Fleeing at double speed (165px/s)
    if (this.boarState === 'fleeing') {
      const dx = this.boarFleeTarget.x - this.wildBoar.x;
      const dy = this.boarFleeTarget.y - this.wildBoar.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = 165;
      this.wildBoar.setVelocity((dx / dist) * speed, (dy / dist) * speed);
      this.wildBoar.setFlipX(dx > 0);

      // Check if safely escaped outside map bounds
      if (
        this.wildBoar.x < -30 ||
        this.wildBoar.x > this.GRID_WIDTH * this.TILE_SIZE + 30 ||
        this.wildBoar.y < -30 ||
        this.wildBoar.y > this.GRID_HEIGHT * this.TILE_SIZE + 30
      ) {
        this.destroyWildBoar();
      }
    }
  }

  public scareWildBoar() {
    if (!this.wildBoar || this.boarState === 'fleeing') return;

    if (this.boarEatingTimer) {
      this.boarEatingTimer.remove();
      this.boarEatingTimer = null;
    }

    if (this.boarEatingTween) {
      this.boarEatingTween.stop();
      this.boarEatingTween = null;
      if (this.wildBoar) {
        this.wildBoar.setScale(1);
      }
    }

    this.boarState = 'fleeing';
    this.showFloatingNotice('💦 Heo rừng hoảng sợ bỏ chạy!', this.wildBoar.x, this.wildBoar.y - 14);

    // Escape straight towards nearest map edge away from player
    const fx = this.wildBoar.x > this.player.x ? (this.GRID_WIDTH * this.TILE_SIZE + 50) : -50;
    const fy = this.wildBoar.y > this.player.y ? (this.GRID_HEIGHT * this.TILE_SIZE + 50) : -50;
    this.boarFleeTarget = { x: fx, y: fy };
  }

  private destroyWildBoar() {
    if (this.boarEatingTimer) {
      this.boarEatingTimer.remove();
      this.boarEatingTimer = null;
    }
    if (this.boarEatingTween) {
      this.boarEatingTween.stop();
      this.boarEatingTween = null;
    }
    if (this.wildBoar) {
      this.wildBoar.destroy();
      this.wildBoar = null;
    }
    // 60 seconds cooldown before next boar can spawn
    this.boarCooldownUntil = Date.now() + 60000;
  }

  shutdown() {
    this.cancelCurrentAction();
    this.stopMovement();
    if (this.boarSpawnTimer) {
      this.boarSpawnTimer.remove();
      this.boarSpawnTimer = null;
    }
    if (this.boarEatingTimer) {
      this.boarEatingTimer.remove();
      this.boarEatingTimer = null;
    }
    if (this.boarEatingTween) {
      this.boarEatingTween.stop();
      this.boarEatingTween = null;
    }
    if (this.wildBoar) {
      this.wildBoar.destroy();
      this.wildBoar = null;
    }
    if (this.currentThrownStone) {
      this.currentThrownStone.destroy();
      this.currentThrownStone = null;
    }
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }
}
