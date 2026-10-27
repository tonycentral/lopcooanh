// src/features/farm/engine/scenes/HouseScene.ts
// Indoor House Scene (10x8 tiles) with Bed, Carpentry Workbench, Exit Doormat & Furniture Placement

import Phaser from 'phaser';
import { useGameStore } from '../../state/useGameStore';
import type { PlacedFurnitureItem } from '../../types';

export default class HouseScene extends Phaser.Scene {
  private hasCustomAtlas = false;
  private returnSpawnX = 288;
  private returnSpawnY = 150;

  // Layout constants
  private readonly ROOM_COLS = 10;
  private readonly ROOM_ROWS = 8;
  private readonly TILE_SIZE = 32;
  private roomStartX = 0;
  private roomStartY = 0;

  // Game Objects
  private player!: Phaser.Physics.Arcade.Sprite;
  private solidGroup!: Phaser.Physics.Arcade.StaticGroup;
  private bedSprite!: Phaser.Physics.Arcade.Sprite;
  private workbenchSprite!: Phaser.Physics.Arcade.Sprite;
  private doormatSprite!: Phaser.GameObjects.Sprite;
  private marker!: Phaser.GameObjects.Graphics;
  private bedTooltip!: Phaser.GameObjects.Container;
  private workbenchTooltip!: Phaser.GameObjects.Container;
  private doorTooltip!: Phaser.GameObjects.Container;
  private placedSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  // Controls & State
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private interactKey?: Phaser.Input.Keyboard.Key;
  private isInputBlocked = false;
  private playerSpeed = 130;
  private lastDirection: 'down' | 'up' | 'left' | 'right' = 'up';
  private unsubscribeStore?: () => void;

  constructor() {
    super('HouseScene');
  }

  init(data?: { hasCustomAtlas?: boolean; returnSpawnX?: number; returnSpawnY?: number }) {
    this.hasCustomAtlas = Boolean(data?.hasCustomAtlas);
    if (data?.returnSpawnX !== undefined) this.returnSpawnX = data.returnSpawnX;
    if (data?.returnSpawnY !== undefined) this.returnSpawnY = data.returnSpawnY;
  }

  create() {
    this.roomStartX = Math.floor((this.scale.width - this.ROOM_COLS * this.TILE_SIZE) / 2);
    this.roomStartY = Math.floor((this.scale.height - this.ROOM_ROWS * this.TILE_SIZE) / 2);

    this.solidGroup = this.physics.add.staticGroup();

    // 1. Render Room Walls, Floors, and Doormat
    this.createRoomGeometry();

    // 2. Fixed Furniture: Bed & Carpentry Workbench
    this.createFixedFurniture();

    // 3. Render User Placed Furniture
    this.renderPlacedFurniture();

    // 4. Player Character
    this.createPlayer();

    // 5. Colliders
    this.physics.add.collider(this.player, this.solidGroup);

    // 6. Camera Setup
    const roomCenterX = this.roomStartX + (this.ROOM_COLS * this.TILE_SIZE) / 2;
    const roomCenterY = this.roomStartY + (this.ROOM_ROWS * this.TILE_SIZE) / 2;
    this.cameras.main.centerOn(roomCenterX, roomCenterY);
    this.cameras.main.setZoom(1.6);

    // 7. Input Controls
    this.setupInputControls();

    // 8. Tile Placement Preview Marker
    this.marker = this.add.graphics().setDepth(25);

    // 9. Subscribe to Store Updates (for placed furniture synchronization)
    this.unsubscribeStore = useGameStore.subscribe((state) => {
      this.syncPlacedFurniture(state.indoorPlacedItems || []);
    });

    this.events.once('shutdown', () => {
      if (this.unsubscribeStore) {
        this.unsubscribeStore();
        this.unsubscribeStore = undefined;
      }
    });
  }

  private createRoomGeometry() {
    // Warm outer room vignette shadow
    const bgGraphics = this.add.graphics().setDepth(0);
    bgGraphics.fillStyle(0x0a0f1d, 1);
    bgGraphics.fillRect(0, 0, this.scale.width, this.scale.height);

    for (let row = 0; row < this.ROOM_ROWS; row++) {
      for (let col = 0; col < this.ROOM_COLS; col++) {
        const x = this.roomStartX + col * this.TILE_SIZE + 16;
        const y = this.roomStartY + row * this.TILE_SIZE + 16;

        const isTopWall = row < 2;
        const isSideWall = col === 0 || col === this.ROOM_COLS - 1;
        const isBottomRow = row === this.ROOM_ROWS - 1;
        const isDoorway = isBottomRow && (col === 4 || col === 5);

        if (isDoorway) {
          // Doormat exit
          this.doormatSprite = this.add.sprite(x, y, 'indoor_doormat').setDepth(2);
        } else if (isTopWall || isSideWall || isBottomRow) {
          // Solid Wall
          const wall = this.solidGroup.create(x, y, 'indoor_wall') as Phaser.Physics.Arcade.Sprite;
          wall.setDepth(row === 0 ? 1 : 12);
          wall.setImmovable(true);
          wall.refreshBody();
        } else {
          // Parquet Floor
          this.add.sprite(x, y, 'indoor_floor_wood').setDepth(1);
        }
      }
    }

    // Doorway exit prompt
    const doorPromptX = this.roomStartX + 4.5 * this.TILE_SIZE + 16;
    const doorPromptY = this.roomStartY + 7 * this.TILE_SIZE + 4;
    this.doorTooltip = this.createTooltip(doorPromptX, doorPromptY, '🚪 Bước qua thảm để ra nông trại');
  }

  private createFixedFurniture() {
    // Bed at col 1, row 2 (32x32)
    const bedX = this.roomStartX + 1 * this.TILE_SIZE + 16;
    const bedY = this.roomStartY + 2 * this.TILE_SIZE + 16;
    this.bedSprite = this.physics.add.sprite(bedX, bedY, 'furniture_bed');
    this.bedSprite.setDepth(10);
    this.bedSprite.setImmovable(true);
    (this.bedSprite.body as Phaser.Physics.Arcade.Body).moves = false;
    this.bedSprite.body.setSize(30, 26).setOffset(1, 4);
    this.solidGroup.add(this.bedSprite);

    this.bedSprite.setInteractive({ useHandCursor: true });
    this.bedSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.rightButtonDown()) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, bedX, bedY);
      if (dist <= 48) {
        this.restInBed();
      }
    });

    this.bedTooltip = this.createTooltip(bedX, bedY - 26, '🛏️ [E] Đi Ngủ (Hồi phục 100% Thể Lực)');

    // Workbench at col 8, row 2 (32x32)
    const wbX = this.roomStartX + 8 * this.TILE_SIZE + 16;
    const wbY = this.roomStartY + 2 * this.TILE_SIZE + 16;
    this.workbenchSprite = this.physics.add.sprite(wbX, wbY, 'furniture_workbench');
    this.workbenchSprite.setDepth(10);
    this.workbenchSprite.setImmovable(true);
    (this.workbenchSprite.body as Phaser.Physics.Arcade.Body).moves = false;
    this.workbenchSprite.body.setSize(30, 26).setOffset(1, 4);
    this.solidGroup.add(this.workbenchSprite);

    this.workbenchSprite.setInteractive({ useHandCursor: true });
    this.workbenchSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.rightButtonDown()) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, wbX, wbY);
      if (dist <= 48) {
        this.openCarpentryWorkbench();
      }
    });

    this.workbenchTooltip = this.createTooltip(wbX, wbY - 26, '🔨 [E] Bàn Thợ Mộc (Chế Tạo Nội Thất)');
  }

  private createTooltip(x: number, y: number, text: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(30).setVisible(false);
    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.92);
    bg.lineStyle(1.5, 0xf59e0b, 0.85);
    bg.fillRoundedRect(-110, -12, 220, 24, 6);
    bg.strokeRoundedRect(-110, -12, 220, 24, 6);

    const txt = this.add.text(0, 0, text, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }).setOrigin(0.5, 0.5);

    container.add([bg, txt]);
    return container;
  }

  private renderPlacedFurniture() {
    const placedItems = useGameStore.getState().indoorPlacedItems || [];
    this.syncPlacedFurniture(placedItems);
  }

  private syncPlacedFurniture(items: PlacedFurnitureItem[]) {
    // Remove sprites no longer in store
    const currentItemIds = new Set(items.map((i) => i.id));
    for (const [id, sprite] of this.placedSprites.entries()) {
      if (!currentItemIds.has(id)) {
        if ((sprite.body as Phaser.Physics.Arcade.Body)) {
          this.solidGroup.remove(sprite, true, true);
        } else {
          sprite.destroy();
        }
        this.placedSprites.delete(id);
      }
    }

    // Add or update sprites
    for (const item of items) {
      if (!this.placedSprites.has(item.id)) {
        const x = this.roomStartX + item.gridX * this.TILE_SIZE + 16;
        const y = this.roomStartY + item.gridY * this.TILE_SIZE + 16;
        const sprite = this.physics.add.sprite(x, y, item.itemId);

        const isWalkable = item.itemId === 'furniture_rug';
        if (isWalkable) {
          sprite.setDepth(2);
          (sprite.body as Phaser.Physics.Arcade.Body).enable = false;
        } else {
          sprite.setDepth(10);
          sprite.setImmovable(true);
          (sprite.body as Phaser.Physics.Arcade.Body).moves = false;
          sprite.body.setSize(28, 24).setOffset(2, 6);
          this.solidGroup.add(sprite);
        }

        sprite.setInteractive({ useHandCursor: true });
        sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (this.isInputBlocked) return;
          // Right click or pickaxe tool dismantles furniture
          const activeTool = useGameStore.getState().activeTool;
          if (pointer.rightButtonDown() || activeTool === 'pickaxe') {
            useGameStore.getState().pickupIndoorFurniture(item.id);
          }
        });

        this.placedSprites.set(item.id, sprite);
      }
    }
  }

  private createPlayer() {
    // Spawn in front of doormat
    const spawnX = this.roomStartX + 4.5 * this.TILE_SIZE + 16;
    const spawnY = this.roomStartY + 6 * this.TILE_SIZE + 16;

    const initialFrame = this.hasCustomAtlas && this.textures.exists('farm_atlas') && this.textures.get('farm_atlas').has('player_idle_up')
      ? 'player_idle_up'
      : undefined;

    if (initialFrame) {
      this.player = this.physics.add.sprite(spawnX, spawnY, 'farm_atlas', initialFrame);
    } else {
      this.player = this.physics.add.sprite(spawnX, spawnY, 'farmer_sprite');
    }

    this.player.setCollideWorldBounds(true);
    this.player.setDepth(15);
    this.player.body.setSize(16, 12).setOffset(8, 20);
  }

  private setupInputControls() {
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

    // Pointer move for furniture placement preview
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.updatePlacementMarker(pointer);
    });

    // Pointer down for placing furniture
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isInputBlocked || pointer.button !== 0) return;
      const activeTool = useGameStore.getState().activeTool;
      if (!activeTool.startsWith('furniture_')) return;

      const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const gx = Math.floor((worldPoint.x - this.roomStartX) / this.TILE_SIZE);
      const gy = Math.floor((worldPoint.y - this.roomStartY) / this.TILE_SIZE);

      if (this.canPlaceFurniture(gx, gy)) {
        useGameStore.getState().placeIndoorFurniture(activeTool, gx, gy);
      }
    });
  }

  private canPlaceFurniture(gx: number, gy: number): boolean {
    // Bounds check: inside walkable room
    if (gx < 1 || gx > 8 || gy < 2 || gy > 6) return false;
    // Bed spot
    if (gx === 1 && (gy === 2 || gy === 3)) return false;
    // Workbench spot
    if (gx === 8 && gy === 2) return false;
    // Doormat row front exit spot: allow or avoid? gy === 6 at gx === 4 or 5 is right in front of door
    const existing = useGameStore.getState().indoorPlacedItems || [];
    if (existing.some((i) => i.gridX === gx && i.gridY === gy)) return false;
    return true;
  }

  private updatePlacementMarker(pointer: Phaser.Input.Pointer) {
    this.marker.clear();
    const activeTool = useGameStore.getState().activeTool;
    if (!activeTool.startsWith('furniture_')) return;

    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const gx = Math.floor((worldPoint.x - this.roomStartX) / this.TILE_SIZE);
    const gy = Math.floor((worldPoint.y - this.roomStartY) / this.TILE_SIZE);

    if (gx >= 0 && gx < this.ROOM_COLS && gy >= 0 && gy < this.ROOM_ROWS) {
      const tileX = this.roomStartX + gx * this.TILE_SIZE;
      const tileY = this.roomStartY + gy * this.TILE_SIZE;
      const valid = this.canPlaceFurniture(gx, gy);

      this.marker.lineStyle(2, valid ? 0x22c55e : 0xef4444, 0.9);
      this.marker.fillStyle(valid ? 0x22c55e : 0xef4444, 0.25);
      this.marker.strokeRect(tileX, tileY, this.TILE_SIZE, this.TILE_SIZE);
      this.marker.fillRect(tileX, tileY, this.TILE_SIZE, this.TILE_SIZE);
    }
  }

  public setModalOpen(isOpen: boolean) {
    this.isInputBlocked = isOpen;
    if (this.input.keyboard) {
      this.input.keyboard.enabled = !isOpen;
    }
    if (isOpen) {
      if (this.player && this.player.body) {
        this.player.setVelocity(0, 0);
      }
      this.marker.clear();
    }
  }

  private restInBed() {
    useGameStore.getState().restInBed();

    // Floating text recovery effect
    const floatTxt = this.add.text(this.bedSprite.x, this.bedSprite.y - 10, '⚡ Thể Lực 100% 💤', {
      fontSize: '13px',
      color: '#38bdf8',
      fontStyle: 'bold',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      stroke: '#0f172a',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(40);

    this.tweens.add({
      targets: floatTxt,
      y: this.bedSprite.y - 35,
      alpha: { from: 1, to: 0 },
      duration: 1600,
      onComplete: () => floatTxt.destroy()
    });
  }

  private openCarpentryWorkbench() {
    this.game.events.emit('open-furniture-craft');
  }

  private exitToFarm() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = undefined;
    }
    this.scene.start('FarmScene', {
      hasCustomAtlas: this.hasCustomAtlas,
      spawnX: this.returnSpawnX,
      spawnY: this.returnSpawnY
    });
  }

  override update() {
    if (this.isInputBlocked) return;

    // 1. Proximity checks for Bed, Workbench & Doormat
    const distToBed = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bedSprite.x, this.bedSprite.y);
    const isNearBed = distToBed <= 48;
    this.bedTooltip.setVisible(isNearBed);

    const distToWb = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.workbenchSprite.x, this.workbenchSprite.y);
    const isNearWb = distToWb <= 48;
    this.workbenchTooltip.setVisible(isNearWb);

    const doormatY = this.roomStartY + 7 * this.TILE_SIZE + 16;
    const doormatCenterX = this.roomStartX + 4.5 * this.TILE_SIZE + 16;
    const distToDoormat = Phaser.Math.Distance.Between(this.player.x, this.player.y, doormatCenterX, doormatY);
    const isNearDoor = distToDoormat <= 36;
    this.doorTooltip.setVisible(isNearDoor);

    // E key interaction
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      if (isNearBed) {
        this.restInBed();
        return;
      }
      if (isNearWb) {
        this.openCarpentryWorkbench();
        return;
      }
      if (isNearDoor) {
        this.exitToFarm();
        return;
      }
    }

    // Step on doormat trigger
    if (distToDoormat <= 20) {
      this.exitToFarm();
      return;
    }

    // 2. Keyboard Movement
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

    if (vx < 0) this.lastDirection = 'left';
    else if (vx > 0) this.lastDirection = 'right';
    else if (vy < 0) this.lastDirection = 'up';
    else if (vy > 0) this.lastDirection = 'down';

    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      const walkAnim = `walk_${this.lastDirection}`;
      if (this.anims.exists(walkAnim)) {
        this.player.anims.play(walkAnim, true);
      }
    } else {
      const idleAnim = `idle_${this.lastDirection}`;
      if (this.anims.exists(idleAnim)) {
        this.player.anims.play(idleAnim, true);
      }
    }
  }
}
