// src/features/farm/engine/systems/Pathfinding.ts
// A* Pathfinding Service for 2D Farm Grid (30x20 Tiles, 4-Directional Movement)

export interface GridPoint {
  x: number;
  y: number;
}

export type IsWalkableFn = (gx: number, gy: number) => boolean;

interface AStarNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

const CARDINAL_DIRS: ReadonlyArray<GridPoint> = [
  { x: 0, y: -1 }, // Up
  { x: 0, y: 1 },  // Down
  { x: -1, y: 0 }, // Left
  { x: 1, y: 0 }   // Right
];

/**
 * Computes Manhattan distance heuristic between two points
 */
function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Searches for the shortest path between start and goal on a 4-directional grid using A*.
 *
 * @param start Starting tile coordinates
 * @param goal Goal tile coordinates
 * @param isWalkable Callback function returning whether (gx, gy) is walkable
 * @param gridWidth Width of the grid (default 30)
 * @param gridHeight Height of the grid (default 20)
 * @returns Array of waypoints excluding the start tile, or null if unreachable
 */
export function findAStarPath(
  start: GridPoint,
  goal: GridPoint,
  isWalkable: IsWalkableFn,
  gridWidth = 30,
  gridHeight = 20
): GridPoint[] | null {
  // 1. Boundary & identical point check
  if (start.x === goal.x && start.y === goal.y) {
    return [];
  }

  if (goal.x < 0 || goal.x >= gridWidth || goal.y < 0 || goal.y >= gridHeight) {
    return null;
  }

  const totalTiles = gridWidth * gridHeight;
  const closedSet = new Uint8Array(totalTiles);
  const openMap = new Map<number, AStarNode>();

  const startH = manhattanDistance(start.x, start.y, goal.x, goal.y);
  const startNode: AStarNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: startH,
    f: startH,
    parent: null
  };

  const startIndex = start.y * gridWidth + start.x;
  openMap.set(startIndex, startNode);

  while (openMap.size > 0) {
    // Find node with lowest f-score in open set
    let current: AStarNode | null = null;
    let currentIndex = -1;
    let lowestF = Infinity;

    for (const [idx, node] of openMap.entries()) {
      if (node.f < lowestF) {
        lowestF = node.f;
        current = node;
        currentIndex = idx;
      }
    }

    if (!current) break;

    // Check if goal reached
    if (current.x === goal.x && current.y === goal.y) {
      // Reconstruct path backward
      const path: GridPoint[] = [];
      let curr: AStarNode | null = current;

      while (curr && (curr.x !== start.x || curr.y !== start.y)) {
        path.push({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }

      path.reverse();
      return path;
    }

    // Move current from open to closed
    openMap.delete(currentIndex);
    closedSet[currentIndex] = 1;

    // Explore 4 cardinal neighbors
    for (const dir of CARDINAL_DIRS) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;

      // Out of bounds check
      if (nx < 0 || nx >= gridWidth || ny < 0 || ny >= gridHeight) {
        continue;
      }

      const nIndex = ny * gridWidth + nx;

      // Closed set check
      if (closedSet[nIndex] === 1) {
        continue;
      }

      // Walkable check (goal is allowed if it's the target point)
      const isGoal = nx === goal.x && ny === goal.y;
      if (!isGoal && !isWalkable(nx, ny)) {
        continue;
      }

      const tentativeG = current.g + 1;
      const existing = openMap.get(nIndex);

      if (!existing || tentativeG < existing.g) {
        const h = manhattanDistance(nx, ny, goal.x, goal.y);
        const neighborNode: AStarNode = {
          x: nx,
          y: ny,
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current
        };
        openMap.set(nIndex, neighborNode);
      }
    }
  }

  // No path exists
  return null;
}

/**
 * Finds the shortest valid path to any walkable adjacent neighbor of a solid/interaction target.
 * Useful when interacting with solid obstacles (rocks, wood logs, campfire, bbq stand, chests, fences).
 *
 * @param start Current player grid coordinates
 * @param target Target grid coordinates (can be solid)
 * @param isWalkable Callback returning whether tile is walkable
 * @param gridWidth Width of grid
 * @param gridHeight Height of grid
 * @returns Best path and destination tile, or null if unreachable
 */
export function findBestAdjacentPath(
  start: GridPoint,
  target: GridPoint,
  isWalkable: IsWalkableFn,
  gridWidth = 30,
  gridHeight = 20
): { path: GridPoint[]; destination: GridPoint } | null {
  // 1. Gather all walkable adjacent candidates (North, South, West, East)
  const candidateNeighbors: GridPoint[] = [];

  for (const dir of CARDINAL_DIRS) {
    const cx = target.x + dir.x;
    const cy = target.y + dir.y;

    if (cx >= 0 && cx < gridWidth && cy >= 0 && cy < gridHeight) {
      if (isWalkable(cx, cy)) {
        candidateNeighbors.push({ x: cx, y: cy });
      }
    }
  }

  if (candidateNeighbors.length === 0) {
    return null;
  }

  // 2. Check if player is already standing on one of the adjacent candidates
  for (const cand of candidateNeighbors) {
    if (cand.x === start.x && cand.y === start.y) {
      return { path: [], destination: cand };
    }
  }

  // 3. Find path to each candidate and pick the shortest
  let bestPath: GridPoint[] | null = null;
  let bestDest: GridPoint | null = null;

  for (const cand of candidateNeighbors) {
    const path = findAStarPath(start, cand, isWalkable, gridWidth, gridHeight);
    if (path !== null) {
      if (bestPath === null || path.length < bestPath.length) {
        bestPath = path;
        bestDest = cand;
      }
    }
  }

  if (bestPath !== null && bestDest !== null) {
    return { path: bestPath, destination: bestDest };
  }

  return null;
}
