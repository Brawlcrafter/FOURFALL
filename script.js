const OWNER = { PLAYER: "player", ENEMY: "enemy" };
const NEUTRAL = "neutral";
const EMPTY = null;
const BASE_ROWS = 6;
const BASE_COLUMNS = 7;
const BASE_WIN = 4;
const TARGET_WINS = 10;
const PIECE_COST = 5;
const ACHIEVEMENT_KEY = "fourfall-achievements-v1";

const PIECE = {
  NORMAL: "normal",
  VIRUS: "virus",
  BOMB: "bomb",
  ANCHOR: "anchor",
  SWAP: "swap",
  SPLIT: "split",
  FREEZE: "freeze",
  GRAVITY: "gravity",
  MAGNET: "magnet",
  DYNAMITE: "dynamite",
};

const PIECE_INFO = {
  normal: { name: "Normal", text: "Klassischer Stein ohne Effekt." },
  virus: { name: "Virus", text: "Nach 3 Runden werden links, rechts, oben und unten zu deinem Besitz konvertiert." },
  bomb: { name: "Bombe", text: "Sprengt nach 3 Runden alle umliegenden Steine. Anchor bleibt bestehen." },
  anchor: { name: "Anchor", text: "Kann nicht bewegt, gesprengt oder konvertiert werden." },
  swap: { name: "Swap", text: "Tauscht nach dem Einwurf mit einem zufaelligen gegnerischen Stein." },
  split: { name: "Split", text: "Wirft links und rechts je einen normalen Stein ein, aber keinen in die Zielspalte." },
  freeze: { name: "Freeze", text: "Friert die Zielspalte fuer 5 Zuege ein." },
  gravity: { name: "Gravity", text: "Kann in der Luft platziert werden, statt ganz nach unten zu fallen." },
  magnet: { name: "Magnet", text: "Zieht benachbarte Steine ein Feld zu sich heran." },
  dynamite: { name: "Dynamit", text: "Sprengt nach 3 Runden die ganze Reihe. Explodiert sofort, wenn es von einer Explosion getroffen wird." },
};

const BUYABLE_TYPES = [
  PIECE.VIRUS,
  PIECE.BOMB,
  PIECE.ANCHOR,
  PIECE.SWAP,
  PIECE.SPLIT,
  PIECE.FREEZE,
  PIECE.GRAVITY,
  PIECE.MAGNET,
  PIECE.DYNAMITE,
];

const PERKS = [
  { id: "random", name: "Random", text: "20% Chance, dass dein normaler Stein ein zufaelliger Spezialtyp wird." },
  { id: "vision", name: "Vision", text: "Zeigt den naechsten geplanten Zug der AI an." },
  { id: "freezeMaster", name: "Freeze Master", text: "Du erhaeltst Ladungen, um Spalten fuer 5 Zuege einzufrieren." },
  { id: "lower", name: "Lower", text: "Deine Win-Condition wird um 1 gesenkt." },
  { id: "higher", name: "Higher", text: "Die gegnerische Win-Condition wird um 1 erhoeht." },
  { id: "deletion", name: "Deletion", text: "Einmal pro Spiel kannst du einen Gegnerstein loeschen." },
];

const BOSSES = [
  {
    id: "wall",
    name: "The Wall",
    text: "Alle 2 Bosszuege wird eine komplette Spalte fuer 4 Runden mit Anchor-Steinen versiegelt.",
  },
  {
    id: "defender",
    name: "The Defender",
    text: "Spielt extrem defensiv und blockt auch potenzielle zukuenftige Reihen.",
  },
  {
    id: "gravityLord",
    name: "The Gravity Lord",
    text: "Nach Bosszuegen rutschen alle Steine zufaellig nach oben, links, rechts oder unten.",
  },
  {
    id: "infection",
    name: "The Infection",
    text: "Jeder 3. Bossstein ist ein Virus.",
  },
  {
    id: "chaos",
    name: "The Chaos",
    text: "Jeder Bossstein ist ein zufaelliger Spezialtyp.",
  },
  {
    id: "exploding",
    name: "The Exploding",
    text: "Jeder 2. Bossstein ist eine Bombe.",
  },
  {
    id: "architect",
    name: "The Rule Architect",
    text: "Veraendert alle 5 Bosszuege die Win-Regel oder erlaubte Richtung.",
  },
  {
    id: "random",
    name: "The Random",
    text: "Jeden 3. Bosszug wird ein zufaelliger deiner Steine zu seinem.",
  },
];

const FINAL_BOSS = {
  id: "game",
  name: "THE GAME ITSELF",
  text: "Endboss: nimmt jede Runde die Eigenschaft eines zufaelligen Bosses an und glitcht dabei sichtbar.",
};

const ACHIEVEMENTS = [
  ...BOSSES.map((boss) => ({ id: `boss:${boss.id}`, name: `Besiege ${boss.name}`, text: `Besiege ${boss.name} in einem Run.` })),
  { id: "boss:game", name: "Besiege THE GAME ITSELF", text: "Besiege den Endboss." },
  { id: "run:win", name: "Gewinne einen Run", text: "Schaffe 10 Siege hintereinander." },
  ...BUYABLE_TYPES.map((type) => ({ id: `run:no-${type}`, name: `Run ohne ${PIECE_INFO[type].name}`, text: `Gewinne einen Run, ohne ${PIECE_INFO[type].name} zu verwenden.` })),
  { id: "run:no-powers", name: "Run ohne Faehigkeiten", text: "Gewinne einen Run, ohne Freeze Master oder Deletion zu nutzen." },
  { id: "run:normal-only", name: "Nur normale Steine", text: "Gewinne einen Run, ohne Spezialsteine zu verwenden." },
];

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#status");
const runButton = document.querySelector("#runButton");
const tutorialButton = document.querySelector("#tutorialButton");
const shopButton = document.querySelector("#shopButton");
const startScreen = document.querySelector("#startScreen");
const startRunButton = document.querySelector("#startRunButton");
const continueMenuButton = document.querySelector("#continueMenuButton");
const trainingButton = document.querySelector("#trainingButton");
const trainingBossSelect = document.querySelector("#trainingBossSelect");
const shopScreen = document.querySelector("#shopScreen");
const shopGrid = document.querySelector("#shopGrid");
const shopText = document.querySelector("#shopText");
const nextBattleButton = document.querySelector("#nextBattleButton");
const perkScreen = document.querySelector("#perkScreen");
const perkGrid = document.querySelector("#perkGrid");
const winnerScreen = document.querySelector("#winnerScreen");
const winnerKicker = document.querySelector("#winnerKicker");
const winnerTitle = document.querySelector("#winnerTitle");
const winnerText = document.querySelector("#winnerText");
const continueRunButton = document.querySelector("#continueRunButton");
const trainingMenuButton = document.querySelector("#trainingMenuButton");
const newRunButton = document.querySelector("#newRunButton");
const turnIndicator = document.querySelector("#turnIndicator");
const streakLabel = document.querySelector("#streakLabel");
const enemyLabel = document.querySelector("#enemyLabel");
const winLabel = document.querySelector("#winLabel");
const enemyWinLabel = document.querySelector("#enemyWinLabel");
const moneyLabel = document.querySelector("#moneyLabel");
const inventoryTray = document.querySelector("#inventoryTray");
const perkTray = document.querySelector("#perkTray");
const freezePowerButton = document.querySelector("#freezePowerButton");
const deletePowerButton = document.querySelector("#deletePowerButton");
const visionBox = document.querySelector("#visionBox");
const tutorialPieces = document.querySelector("#tutorialPieces");
const tutorialPerks = document.querySelector("#tutorialPerks");
const tutorialBosses = document.querySelector("#tutorialBosses");
const tutorialAchievements = document.querySelector("#tutorialAchievements");

let run = null;
let match = null;
let board = [];
let currentOwner = OWNER.PLAYER;
let selectedPieceType = PIECE.NORMAL;
let targetingPower = null;
let audioContext = null;
let achievements = loadAchievements();

function startRun() {
  trainingMenuButton.classList.add("hidden");
  run = {
    training: false,
    wins: 0,
    money: 0,
    perks: [],
    powerCharges: { freezeMaster: 0, deletion: 0 },
    usedPieces: new Set(),
    usedPowers: false,
    inventory: Object.fromEntries(BUYABLE_TYPES.map((type) => [type, 0])),
    rng: createSeededRandom(Date.now() % 1000000),
    pendingShop: false,
  };
  selectedPieceType = PIECE.NORMAL;
  targetingPower = null;
  hideOverlays();
  startBattle();
}

function startTraining() {
  trainingMenuButton.classList.add("hidden");
  const boss = [...BOSSES, FINAL_BOSS].find((item) => item.id === trainingBossSelect.value) ?? BOSSES[0];
  run = {
    training: true,
    trainingBoss: boss,
    wins: 0,
    money: 0,
    perks: [],
    powerCharges: { freezeMaster: 99, deletion: 99 },
    usedPieces: new Set(),
    usedPowers: false,
    inventory: Object.fromEntries(BUYABLE_TYPES.map((type) => [type, Infinity])),
    rng: createSeededRandom(Date.now() % 1000000),
    pendingShop: false,
  };
  selectedPieceType = PIECE.NORMAL;
  targetingPower = null;
  hideOverlays();
  startBattle();
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function rng() {
  return run?.rng ? run.rng() : Math.random();
}

function randomItem(items) {
  return items[Math.floor(rng() * items.length)];
}

function loadAchievements() {
  try {
    return new Set(JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)) ?? []);
  } catch {
    return new Set();
  }
}

function saveAchievements() {
  localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify([...achievements]));
}

function unlockAchievement(id) {
  if (achievements.has(id)) return;
  achievements.add(id);
  saveAchievements();
  const achievement = ACHIEVEMENTS.find((item) => item.id === id);
  if (achievement) {
    flashRule(`ERFOLG: ${achievement.name}`);
  }
}

function startBattle() {
  if (!run) {
    startRun();
    return;
  }

  const round = run.training ? 1 : run.wins + 1;
  const boss = run.training ? run.trainingBoss : getBossForRound(round);
  const rows = run.training ? BASE_ROWS : BASE_ROWS + run.wins;
  const columns = run.training ? BASE_COLUMNS : BASE_COLUMNS + run.wins;
  board = createBoard(rows, columns);
  currentOwner = OWNER.PLAYER;
  selectedPieceType = PIECE.NORMAL;
  targetingPower = null;
  match = {
    round,
    boss,
    rows,
    columns,
    playerWin: Math.max(3, BASE_WIN + (run.training ? 0 : run.wins) - countPerk("lower")),
    enemyWin: BASE_WIN + countPerk("higher"),
    allowedDirections: null,
    turn: 1,
    bossTurns: 0,
    gameOver: false,
    aiThinking: false,
    lastMove: null,
    frozenColumns: new Map(),
    sealedColumns: new Map(),
    activeGameBoss: null,
    ruleText: "Alle Richtungen zaehlen.",
  };
  refreshPowerCharges();
  run.pendingShop = false;
  statusElement.textContent = boss ? `${boss.name} wartet.` : "PLAYER ist am Zug";
  playSound(boss ? "boss" : "start");
  updateHud();
  renderBoard();
  updatePlayerVision();
}

function createBoard(rows, columns) {
  return Array.from({ length: rows }, () => Array(columns).fill(EMPTY));
}

function refreshPowerCharges() {
  if (run.training) {
    run.powerCharges.freezeMaster = 99;
    run.powerCharges.deletion = 99;
    return;
  }

  if (hasPerk("freezeMaster")) {
    run.powerCharges.freezeMaster += 1;
  }

  if (hasPerk("deletion")) {
    run.powerCharges.deletion += 1;
  }
}

function getBossForRound(round) {
  if (round === TARGET_WINS) {
    return FINAL_BOSS;
  }

  if (round % 2 === 0) {
    return randomItem(BOSSES);
  }

  return null;
}

function renderBoard(winningCells = []) {
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${match?.columns ?? BASE_COLUMNS}, 1fr)`;
  boardElement.style.aspectRatio = `${match?.columns ?? BASE_COLUMNS} / ${match?.rows ?? BASE_ROWS}`;
  const wins = new Set(winningCells.map(([row, column]) => cellKey(row, column)));

  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      const piece = board[row][column];
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.disabled = !match || match.gameOver || match.aiThinking || currentOwner !== OWNER.PLAYER;

      if (piece) {
        cell.classList.add(piece.owner, piece.type);
        if (match.lastMove?.row === row && match.lastMove?.column === column) {
          cell.style.setProperty("--drop-distance", `${-Math.max(120, (row + 1) * 50)}px`);
        } else {
          cell.classList.add("settled");
        }
        if (piece.timer) {
          cell.dataset.timer = piece.timer;
        }
      }

      if (match.frozenColumns.has(column) || match.sealedColumns.has(column)) {
        cell.classList.add("blocked");
      }

      if (wins.has(cellKey(row, column))) {
        cell.classList.add("win");
      }

      boardElement.append(cell);
    }
  }
}

function handleBoardClick(row, column) {
  if (!match || match.gameOver || match.aiThinking || currentOwner !== OWNER.PLAYER) {
    return;
  }

  if (targetingPower === "freeze") {
    useFreezeMaster(column);
    return;
  }

  if (targetingPower === "delete") {
    useDeletion(row, column);
    return;
  }

  const type = selectedPieceType;
  if (type !== PIECE.NORMAL && run.inventory[type] <= 0) {
    selectPiece(PIECE.NORMAL);
    return;
  }

  if (dropPiece(column, OWNER.PLAYER, type, row)) {
    if (type !== PIECE.NORMAL && run.inventory[type] !== Infinity) {
      run.inventory[type] -= 1;
      selectPiece(PIECE.NORMAL);
    }
    resolveAfterMove(OWNER.PLAYER);
  }
}

function dropPiece(column, owner, type = PIECE.NORMAL, targetRow = null) {
  if (isColumnBlocked(column)) {
    playSound("blocked");
    return false;
  }

  if (type === PIECE.SPLIT) {
    let placed = false;
    if (owner === OWNER.PLAYER) {
      recordPlayerPiece(PIECE.SPLIT);
    }
    for (const sideColumn of [column - 1, column + 1]) {
      if (sideColumn >= 0 && sideColumn < match.columns && !isColumnBlocked(sideColumn)) {
        placed = dropSinglePiece(sideColumn, owner, PIECE.NORMAL) || placed;
      }
    }
    if (placed) {
      flashRule("SPLIT");
      tickTimedEffects();
      renderBoard();
    }
    return placed;
  }

  const finalType = chooseActualPieceType(owner, type);
  if (owner === OWNER.PLAYER) {
    recordPlayerPiece(finalType);
  }
  const placed = dropSinglePiece(column, owner, finalType, targetRow);
  if (placed) {
    tickTimedEffects();
    renderBoard();
  }
  return placed;
}

function recordPlayerPiece(type) {
  if (!run || run.training) return;
  run.usedPieces.add(type);
}

function dropSinglePiece(column, owner, type, targetRow = null) {
  const row = findLandingRow(column, type, targetRow);
  if (row === -1) {
    playSound("blocked");
    return false;
  }

  const piece = createPiece(owner, type);
  board[row][column] = piece;
  match.lastMove = { row, column };
  applyLandingEffect(row, column, piece);
  playSound("drop");
  return true;
}

function chooseActualPieceType(owner, requestedType) {
  if (owner === OWNER.PLAYER && requestedType === PIECE.NORMAL && hasPerk("random") && rng() < 0.2) {
    flashRule("RANDOM");
    return randomItem(BUYABLE_TYPES);
  }

  if (owner === OWNER.ENEMY && match.boss) {
    if (bossActive("chaos")) {
      const chaosType = randomItem(BUYABLE_TYPES);
      flashRule(`CHAOS: ${PIECE_INFO[chaosType].name}`);
      return chaosType;
    }
    if (bossActive("exploding") && match.bossTurns % 2 === 0) return PIECE.BOMB;
    if (bossActive("infection") && match.bossTurns % 3 === 0) return PIECE.VIRUS;
  }

  return requestedType;
}

function createPiece(owner, type) {
  return {
    owner,
    type,
    timer: [PIECE.BOMB, PIECE.VIRUS, PIECE.DYNAMITE].includes(type) ? 4 : undefined,
    sealed: false,
  };
}

function findLandingRow(column, type, targetRow = null) {
  if (type === PIECE.GRAVITY) {
    if (targetRow !== null && targetRow >= 0 && targetRow < match.rows && !board[targetRow][column]) {
      return targetRow;
    }

    const emptyRows = board.map((row, index) => (row[column] ? -1 : index)).filter((row) => row !== -1);
    return emptyRows.length ? emptyRows[0] : -1;
  }

  for (let row = match.rows - 1; row >= 0; row -= 1) {
    if (!board[row][column]) {
      return row;
    }
  }
  return -1;
}

function applyLandingEffect(row, column, piece) {
  if (piece.type === PIECE.SWAP) {
    const enemyCells = collectOwnedCells(oppositeOwner(piece.owner)).filter(([r, c]) => board[r][c]?.type !== PIECE.ANCHOR);
    if (enemyCells.length) {
      const [targetRow, targetColumn] = randomItem(enemyCells);
      [board[row][column], board[targetRow][targetColumn]] = [board[targetRow][targetColumn], board[row][column]];
      match.lastMove = { row: targetRow, column: targetColumn };
      flashRule("SWAP");
    }
  }

  if (piece.type === PIECE.FREEZE) {
    freezeColumn(column, 5);
    flashRule("FREEZE");
  }

  if (piece.type === PIECE.MAGNET) {
    magnetPull(row, column);
    flashRule("MAGNET");
  }
}

function tickTimedEffects() {
  const bombs = [];
  const viruses = [];
  const dynamites = [];

  forEachPiece((piece, row, column) => {
    if (!piece.timer) return;
    piece.timer -= 1;
    if (piece.timer > 0) return;
    if (piece.type === PIECE.BOMB) bombs.push([row, column]);
    if (piece.type === PIECE.VIRUS) viruses.push([row, column, piece.owner]);
    if (piece.type === PIECE.DYNAMITE) dynamites.push([row, column]);
  });

  for (const [row, column, owner] of viruses) convertAdjacent(row, column, owner);
  for (const [row, column] of bombs) explodeAround(row, column);
  for (const [row, column] of dynamites) explodeRow(row, column);
  if (bombs.length || dynamites.length) applyGravity();

  tickColumnLocks();
}

function convertAdjacent(row, column, owner) {
  flashRule("VIRUS");
  for (const [r, c] of orthogonal(row, column)) {
    if (board[r]?.[c] && board[r][c].type !== PIECE.ANCHOR) {
      board[r][c].owner = owner;
    }
  }
}

function explodeAround(row, column) {
  flashRule("BOMB");
  playSound("combo");
  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = column - 1; c <= column + 1; c += 1) {
      destroyCell(r, c);
    }
  }
}

function explodeRow(row) {
  flashRule("DYNAMITE");
  playSound("combo");
  for (let column = 0; column < match.columns; column += 1) {
    destroyCell(row, column);
  }
}

function destroyCell(row, column) {
  if (row < 0 || row >= match.rows || column < 0 || column >= match.columns) return;
  const piece = board[row][column];
  if (!piece || piece.type === PIECE.ANCHOR) return;
  if (piece.type === PIECE.DYNAMITE) {
    board[row][column] = EMPTY;
    explodeRow(row);
    return;
  }
  board[row][column] = EMPTY;
}

function magnetPull(row, column) {
  const pullDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of pullDirections) {
    const nearRow = row + dr;
    const nearColumn = column + dc;
    const farRow = row + dr * 2;
    const farColumn = column + dc * 2;

    if (
      farRow < 0 ||
      farRow >= match.rows ||
      farColumn < 0 ||
      farColumn >= match.columns ||
      nearRow < 0 ||
      nearRow >= match.rows ||
      nearColumn < 0 ||
      nearColumn >= match.columns
    ) {
      continue;
    }

    const farPiece = board[farRow][farColumn];

    if (farPiece && farPiece.type !== PIECE.ANCHOR && !board[nearRow][nearColumn]) {
      board[nearRow][nearColumn] = farPiece;
      board[farRow][farColumn] = EMPTY;
      match.lastMove = { row: nearRow, column: nearColumn };
    }
  }
}

function orthogonal(row, column) {
  return [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ].filter(([r, c]) => r >= 0 && r < match.rows && c >= 0 && c < match.columns);
}

function applyGravity() {
  for (let column = 0; column < match.columns; column += 1) {
    let writeRow = match.rows - 1;
    for (let row = match.rows - 1; row >= 0; row -= 1) {
      const piece = board[row][column];
      if (!piece) continue;
      if (piece.type === PIECE.ANCHOR) {
        writeRow = row - 1;
        continue;
      }
      if (row !== writeRow) {
        board[writeRow][column] = piece;
        board[row][column] = EMPTY;
        match.lastMove = { row: writeRow, column };
      }
      writeRow -= 1;
    }
  }
}

function resolveAfterMove(owner) {
  const winner = findAnyWin(owner);
  if (winner.length) {
    finishBattle(owner, winner);
    return;
  }

  if (isDraw()) {
    finishBattle(OWNER.ENEMY, []);
    return;
  }

  if (owner === OWNER.PLAYER) {
    beginEnemyTurn();
    return;
  }

  currentOwner = OWNER.PLAYER;
  match.turn += 1;
  statusElement.textContent = "PLAYER ist am Zug";
  updateHud();
  renderBoard();
  updatePlayerVision();
}

function beginEnemyTurn() {
  currentOwner = OWNER.ENEMY;
  match.aiThinking = true;
  statusElement.textContent = `${match.boss?.name ?? "Enemy"} denkt...`;
  match.bossTurns += 1;
  chooseGameBossAbility();
  applyBossBeforeMove();
  const column = chooseEnemyColumn();
  hideVision();
  updateHud();
  renderBoard();
  window.setTimeout(() => {
    if (!match || match.gameOver) return;
    match.aiThinking = false;
    dropPiece(column, OWNER.ENEMY, PIECE.NORMAL);
    applyBossAfterMove();
    resolveAfterMove(OWNER.ENEMY);
  }, hasPerk("vision") ? 1200 : 520);
}

function chooseEnemyColumn() {
  const valid = getValidColumns();
  if (!valid.length) return 0;

  for (const column of valid) {
    if (wouldWin(column, OWNER.ENEMY)) return column;
  }

  if (bossActive("defender")) {
    const defensive = chooseDefensiveColumn(valid);
    if (defensive !== null) return defensive;
  }

  for (const column of valid) {
    if (wouldWin(column, OWNER.PLAYER)) return column;
  }

  return valid
    .map((column) => ({ column, score: scoreColumn(column, OWNER.ENEMY) }))
    .sort((a, b) => b.score - a.score)[0].column;
}

function chooseDefensiveColumn(valid) {
  let best = null;
  let bestScore = -Infinity;
  for (const column of valid) {
    const row = findLandingRow(column, PIECE.NORMAL);
    const score = countPotential(row, column, OWNER.PLAYER);
    if (score > bestScore) {
      bestScore = score;
      best = column;
    }
  }
  return bestScore >= 2 ? best : null;
}

function scoreColumn(column, owner) {
  const row = findLandingRow(column, PIECE.NORMAL);
  if (row === -1) return -1000;
  const center = (match.columns - 1) / 2;
  return 10 - Math.abs(column - center) + countPotential(row, column, owner) * 3;
}

function countPotential(row, column, owner) {
  if (row < 0) return 0;
  let best = 0;
  for (const [dr, dc] of directions()) {
    let count = 1;
    count += countLine(row, column, dr, dc, owner);
    count += countLine(row, column, -dr, -dc, owner);
    best = Math.max(best, count);
  }
  return best;
}

function countLine(row, column, dr, dc, owner) {
  let count = 0;
  let r = row + dr;
  let c = column + dc;
  while (r >= 0 && r < match.rows && c >= 0 && c < match.columns && board[r][c]?.owner === owner) {
    count += 1;
    r += dr;
    c += dc;
  }
  return count;
}

function applyBossBeforeMove() {
  if (bossActive("wall")) {
    if (match.bossTurns % 2 === 0) sealColumn(randomItem(getOpenColumns()), 4);
  }

  if (bossActive("random") && match.bossTurns % 3 === 0) {
    const playerCells = collectOwnedCells(OWNER.PLAYER).filter(([r, c]) => board[r][c]?.type !== PIECE.ANCHOR);
    if (playerCells.length) {
      const [r, c] = randomItem(playerCells);
      board[r][c].owner = OWNER.ENEMY;
      flashRule("RANDOM");
    }
  }

  if (bossActive("architect")) {
    if (match.bossTurns % 5 === 0) changeRules();
  }
}

function applyBossAfterMove() {
  if (bossActive("gravityLord")) {
    const direction = randomItem(["up", "down", "left", "right"]);
    shiftBoard(direction);
    flashRule(`GRAVITY LORD: ${direction.toUpperCase()}`);
  }
  if (match.boss?.id === "game") {
    document.body.classList.add("glitching");
    window.setTimeout(() => document.body.classList.remove("glitching"), 300);
  }
}

function chooseGameBossAbility() {
  if (match.boss?.id !== "game") {
    match.activeGameBoss = null;
    return;
  }

  match.activeGameBoss = randomItem(BOSSES).id;
  flashRule(`THE GAME: ${BOSSES.find((boss) => boss.id === match.activeGameBoss).name}`);
}

function changeRules() {
  const options = [
    () => {
      match.playerWin += 1;
      match.enemyWin += 1;
      match.ruleText = `Win-Regel veraendert: Beide brauchen jetzt ${match.playerWin}/${match.enemyWin}.`;
      flashRule("RULE: +1 WIN");
    },
    () => {
      match.allowedDirections = [[1, 1], [1, -1]];
      match.ruleText = "Regel aktiv: Nur diagonale Reihen zaehlen.";
      flashRule("RULE: DIAGONAL ONLY");
    },
    () => {
      match.allowedDirections = [[1, 0]];
      match.ruleText = "Regel aktiv: Nur vertikale Reihen zaehlen.";
      flashRule("RULE: VERTICAL ONLY");
    },
    () => {
      match.allowedDirections = [[0, 1]];
      match.ruleText = "Regel aktiv: Nur horizontale Reihen zaehlen.";
      flashRule("RULE: HORIZONTAL ONLY");
    },
  ];
  randomItem(options)();
  updateHud();
}

function shiftBoard(direction) {
  if (direction === "up" || direction === "down") {
    shiftVertical(direction);
    return;
  }

  shiftHorizontal(direction);
}

function shiftVertical(direction) {
  for (let column = 0; column < match.columns; column += 1) {
    const rows = direction === "up" ? range(0, match.rows, 1) : range(match.rows - 1, -1, -1);
    const segment = [];

    for (const row of rows) {
      const piece = board[row][column];
      if (piece?.type === PIECE.ANCHOR) {
        flushVerticalSegment(segment, column, direction);
        segment.length = 0;
      } else {
        segment.push(row);
      }
    }
    flushVerticalSegment(segment, column, direction);
  }
}

function flushVerticalSegment(rows, column, direction) {
  const pieces = rows.map((row) => board[row][column]).filter(Boolean);
  for (const row of rows) board[row][column] = EMPTY;
  const targets = direction === "up" ? rows : [...rows];
  pieces.forEach((piece, index) => {
    board[targets[index]][column] = piece;
    match.lastMove = { row: targets[index], column };
  });
}

function shiftHorizontal(direction) {
  for (let row = 0; row < match.rows; row += 1) {
    const columns = direction === "left" ? range(0, match.columns, 1) : range(match.columns - 1, -1, -1);
    const segment = [];

    for (const column of columns) {
      const piece = board[row][column];
      if (piece?.type === PIECE.ANCHOR) {
        flushHorizontalSegment(row, segment, direction);
        segment.length = 0;
      } else {
        segment.push(column);
      }
    }
    flushHorizontalSegment(row, segment, direction);
  }
}

function flushHorizontalSegment(row, columns, direction) {
  const pieces = columns.map((column) => board[row][column]).filter(Boolean);
  for (const column of columns) board[row][column] = EMPTY;
  const targets = direction === "left" ? columns : [...columns];
  pieces.forEach((piece, index) => {
    board[row][targets[index]] = piece;
    match.lastMove = { row, column: targets[index] };
  });
}

function range(start, stop, step) {
  const values = [];
  for (let value = start; step > 0 ? value < stop : value > stop; value += step) {
    values.push(value);
  }
  return values;
}

function sealColumn(column, turns) {
  if (column === undefined) return;
  match.sealedColumns.set(column, turns);
  for (let row = 0; row < match.rows; row += 1) {
    board[row][column] = { owner: NEUTRAL, type: PIECE.ANCHOR, sealed: true };
  }
  flashRule("THE WALL");
}

function freezeColumn(column, turns) {
  match.frozenColumns.set(column, turns);
}

function tickColumnLocks() {
  tickMap(match.frozenColumns);
  tickMap(match.sealedColumns, (column) => {
    for (let row = 0; row < match.rows; row += 1) {
      if (board[row][column]?.sealed) board[row][column] = EMPTY;
    }
    applyGravity();
  });
}

function tickMap(map, onExpire) {
  for (const [key, value] of [...map.entries()]) {
    if (value <= 1) {
      map.delete(key);
      onExpire?.(key);
    } else {
      map.set(key, value - 1);
    }
  }
}

function findAnyWin(owner) {
  const needed = owner === OWNER.PLAYER ? match.playerWin : match.enemyWin;
  for (let row = 0; row < match.rows; row += 1) {
    for (let column = 0; column < match.columns; column += 1) {
      if (board[row][column]?.owner !== owner) continue;
      for (const [dr, dc] of directions()) {
        const line = [[row, column], ...collectLine(row, column, dr, dc, owner)];
        if (line.length >= needed) return line;
      }
    }
  }
  return [];
}

function collectLine(row, column, dr, dc, owner) {
  const cells = [];
  let r = row + dr;
  let c = column + dc;
  while (r >= 0 && r < match.rows && c >= 0 && c < match.columns && board[r][c]?.owner === owner) {
    cells.push([r, c]);
    r += dr;
    c += dc;
  }
  return cells;
}

function directions() {
  return match.allowedDirections ?? [[0, 1], [1, 0], [1, 1], [1, -1]];
}

function wouldWin(column, owner) {
  const clone = board.map((row) => row.map((piece) => (piece ? { ...piece } : EMPTY)));
  const row = findLandingRow(column, PIECE.NORMAL);
  if (row === -1) return false;
  clone[row][column] = { owner, type: PIECE.NORMAL };
  const original = board;
  board = clone;
  const win = findAnyWin(owner).length > 0;
  board = original;
  return win;
}

function finishBattle(winner, winningCells) {
  match.gameOver = true;
  renderBoard(winningCells);
  winnerScreen.classList.remove("hidden");

  if (run?.training) {
    winnerKicker.textContent = "Training beendet";
    winnerTitle.textContent = winner === OWNER.PLAYER ? "Boss besiegt" : "Training verloren";
    winnerText.textContent = "Du kannst direkt nochmal gegen denselben Boss trainieren.";
    continueRunButton.textContent = "Nochmal";
    trainingMenuButton.classList.remove("hidden");
    playSound(winner === OWNER.PLAYER ? "win" : "lose");
    return;
  }

  trainingMenuButton.classList.add("hidden");

  if (winner !== OWNER.PLAYER) {
    winnerKicker.textContent = "Run verloren";
    winnerTitle.textContent = `${match.boss?.name ?? "Enemy"} gewinnt`;
    winnerText.textContent = "Du musst wieder von vorne beginnen.";
    continueRunButton.textContent = "Neuer Run";
    run = null;
    playSound("lose");
    updateHud();
    return;
  }

  const bossWon = Boolean(match.boss);
  run.wins += 1;
  if (match.boss) {
    unlockAchievement(`boss:${match.boss.id}`);
  }
  run.money += bossWon ? 25 : 10;
  run.pendingShop = true;
  playSound("win");

  if (run.wins >= TARGET_WINS) {
    unlockRunAchievements();
    celebrateRunWin();
    winnerKicker.textContent = "Run geschafft";
    winnerTitle.textContent = "THE GAME ITSELF faellt";
    winnerText.textContent = "10 Siege in Folge. FOURFALL ist gebrochen.";
    continueRunButton.textContent = "Neuer Run";
    run.pendingShop = false;
    return;
  }

  winnerKicker.textContent = bossWon ? "Boss besiegt" : "Sieg";
  winnerTitle.textContent = bossWon ? `${match.boss.name} besiegt` : "Runde gewonnen";
  winnerText.textContent = bossWon ? "+$25 und ein Perk. Danach darfst du shoppen." : "+$10. Danach darfst du shoppen.";
  continueRunButton.textContent = bossWon ? "Perk waehlen" : "Zum Shop";
}

function continueRun() {
  winnerScreen.classList.add("hidden");
  trainingMenuButton.classList.add("hidden");
  if (run?.training) {
    startBattle();
    return;
  }
  if (!run || run.wins >= TARGET_WINS) {
    startRun();
    return;
  }
  if (match?.boss) {
    openPerkChoice();
    return;
  }
  openShop();
}

function unlockRunAchievements() {
  unlockAchievement("run:win");

  for (const type of BUYABLE_TYPES) {
    if (!run.usedPieces.has(type)) {
      unlockAchievement(`run:no-${type}`);
    }
  }

  if (!run.usedPowers) {
    unlockAchievement("run:no-powers");
  }

  if ([...run.usedPieces].every((type) => type === PIECE.NORMAL)) {
    unlockAchievement("run:normal-only");
  }
}

function celebrateRunWin() {
  playVictoryMusic();
  spawnConfetti();
}

function spawnConfetti() {
  const confettiLayer = document.createElement("div");
  confettiLayer.className = "confetti-layer";
  const colors = ["#ffd34a", "#ff3856", "#83e8ff", "#68ff9b", "#b385ff"];

  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("span");
    piece.style.left = `${rng() * 100}%`;
    piece.style.setProperty("--fall-delay", `${rng() * 0.9}s`);
    piece.style.setProperty("--fall-time", `${2.2 + rng() * 1.8}s`);
    piece.style.setProperty("--fall-rotate", `${rng() * 720 - 360}deg`);
    piece.style.background = randomItem(colors);
    confettiLayer.append(piece);
  }

  document.body.append(confettiLayer);
  window.setTimeout(() => confettiLayer.remove(), 5200);
}

function playVictoryMusic() {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  audioContext ??= new AudioEngine();
  if (audioContext.state === "suspended") audioContext.resume();
  const now = audioContext.currentTime;
  const melody = [262, 330, 392, 523, 659, 784, 1046];

  melody.forEach((tone, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = now + index * 0.14;
    oscillator.type = index % 2 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(tone, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.34);
  });
}

function openPerkChoice() {
  perkGrid.innerHTML = "";
  const choices = PERKS.filter((perk) => !run.perks.includes(perk.id) || ["lower", "higher", "random"].includes(perk.id))
    .sort(() => rng() - 0.5)
    .slice(0, 3);
  for (const perk of choices) {
    const button = document.createElement("button");
    button.className = "reward-card";
    button.type = "button";
    button.innerHTML = `<span>${perk.name}</span><small>${perk.text}</small>`;
    button.addEventListener("click", () => {
      run.perks.push(perk.id);
      perkScreen.classList.add("hidden");
      openShop();
      updateHud();
    });
    perkGrid.append(button);
  }
  perkScreen.classList.remove("hidden");
}

function openShop() {
  if (!run) return;
  if (run.training) return;
  if (!run?.pendingShop && !match?.gameOver) return;
  shopGrid.innerHTML = "";
  shopText.textContent = `Geld: $${run.money}. Ein Steintyp kostet $${PIECE_COST}.`;
  for (const type of BUYABLE_TYPES) {
    const info = PIECE_INFO[type];
    const button = document.createElement("button");
    button.className = "reward-card";
    button.type = "button";
    button.disabled = run.money < PIECE_COST;
    button.innerHTML = `<span>${info.name}</span><small>${info.text}</small>`;
    button.addEventListener("click", () => {
      if (run.money < PIECE_COST) return;
      run.money -= PIECE_COST;
      run.inventory[type] += 1;
      openShop();
      updateHud();
    });
    shopGrid.append(button);
  }
  shopScreen.classList.remove("hidden");
}

function nextBattle() {
  shopScreen.classList.add("hidden");
  if (!run) return;
  startBattle();
}

function selectPiece(type) {
  selectedPieceType = type;
  updateHud();
}

function useFreezeMaster(column) {
  targetingPower = null;
  if (!hasPower("freezeMaster")) return;
  freezeColumn(column, 5);
  run.powerCharges.freezeMaster -= 1;
  run.usedPowers = true;
  flashRule("FREEZE MASTER");
  updateHud();
  renderBoard();
}

function useDeletion(row, column) {
  targetingPower = null;
  if (!hasPower("deletion")) return;
  if (board[row]?.[column]?.owner === OWNER.ENEMY && board[row][column].type !== PIECE.ANCHOR) {
    board[row][column] = EMPTY;
    run.powerCharges.deletion -= 1;
    run.usedPowers = true;
    applyGravity();
    flashRule("DELETION");
  }
  updateHud();
  renderBoard();
}

function updatePlayerVision() {
  if (!hasPerk("vision") || !match || match.gameOver) {
    hideVision();
    return;
  }

  const column = chooseEnemyColumn();
  visionBox.textContent = `Vision: AI plant jetzt Spalte ${column + 1}`;
  visionBox.classList.remove("hidden");
}

function hideVision() {
  visionBox.classList.add("hidden");
}

function updateHud() {
  streakLabel.textContent = run?.training ? "Training" : run ? `${run.wins}/${TARGET_WINS}` : "0/10";
  enemyLabel.textContent = match?.boss?.name ?? "Enemy";
  enemyLabel.dataset.tooltip = match?.boss?.text ?? "Gewoehnliche Runde ohne Bossmechanik.";
  enemyLabel.title = enemyLabel.dataset.tooltip;
  enemyLabel.classList.add("has-tooltip");
  const neededWin = match?.playerWin ?? BASE_WIN;
  winLabel.textContent = neededWin;
  winLabel.dataset.tooltip = `Es wird eine Kombination aus ${neededWin} Steinen fuer den Sieg benoetigt.`;
  winLabel.title = winLabel.dataset.tooltip;
  winLabel.classList.add("has-tooltip");
  if (match?.ruleText) {
    winLabel.dataset.tooltip += ` ${match.ruleText}`;
    winLabel.title = winLabel.dataset.tooltip;
  }
  const enemyNeededWin = match?.enemyWin ?? BASE_WIN;
  enemyWinLabel.textContent = enemyNeededWin;
  enemyWinLabel.dataset.tooltip = `Der Gegner braucht eine Kombination aus ${enemyNeededWin} Steinen fuer den Sieg.`;
  enemyWinLabel.title = enemyWinLabel.dataset.tooltip;
  enemyWinLabel.classList.add("has-tooltip");
  moneyLabel.textContent = `$${run?.money ?? 0}`;
  turnIndicator.textContent = currentOwner.toUpperCase();
  turnIndicator.className = `turn-indicator ${currentOwner}`;
  renderInventory();
  renderPerks();
  updatePowerButton(freezePowerButton, "Freeze", "freezeMaster");
  updatePowerButton(deletePowerButton, "Delete", "deletion");
}

function updatePowerButton(button, label, power) {
  const charges = getPowerCharges(power);
  const hasThisPerk = hasPerk(power) || run?.training;
  button.textContent = `${label} x${charges === 99 ? "∞" : charges}`;
  button.disabled = !match || !hasThisPerk || charges <= 0 || currentOwner !== OWNER.PLAYER || match.gameOver || match.aiThinking;
  button.classList.toggle("unowned", !hasThisPerk);
  button.title = hasThisPerk ? `${charges} Ladung(en) verfuegbar.` : "Dieses Perk hast du noch nicht.";
}

function getPowerCharges(power) {
  return run?.powerCharges?.[power] ?? 0;
}

function hasPower(power) {
  return (hasPerk(power) || run?.training) && getPowerCharges(power) > 0;
}

function renderInventory() {
  inventoryTray.innerHTML = "";
  inventoryTray.append(createSelectableChip("Normal", PIECE.NORMAL, "Unbegrenzter normaler Stein."));
  for (const type of BUYABLE_TYPES) {
    const count = run?.inventory[type] ?? 0;
    if (count <= 0) continue;
    inventoryTray.append(createSelectableChip(`${PIECE_INFO[type].name} x${count === Infinity ? "∞" : count}`, type, PIECE_INFO[type].text));
  }
}

function createSelectableChip(text, type, tooltip) {
  const button = document.createElement("button");
  button.className = `chip-button chip ${type} has-tooltip`;
  button.type = "button";
  button.textContent = text;
  button.dataset.tooltip = tooltip;
  button.title = tooltip;
  if (selectedPieceType === type) button.classList.add("selected");
  button.addEventListener("click", () => selectPiece(type));
  return button;
}

function renderPerks() {
  perkTray.innerHTML = "";
  for (const id of run?.perks ?? []) {
    const perk = PERKS.find((item) => item.id === id);
    perkTray.append(createChip(perk.name, "modifier", perk.text));
  }
}

function renderTutorial() {
  tutorialPieces.innerHTML = "";
  tutorialPerks.innerHTML = "";
  tutorialBosses.innerHTML = "";
  tutorialAchievements.innerHTML = "";
  for (const type of BUYABLE_TYPES) {
    tutorialPieces.append(createCodexItem(PIECE_INFO[type].name, PIECE_INFO[type].text, "$5"));
  }
  for (const perk of PERKS) {
    tutorialPerks.append(createCodexItem(perk.name, perk.text, "perk"));
  }
  for (const boss of [...BOSSES, FINAL_BOSS]) {
    tutorialBosses.append(createCodexItem(boss.name, boss.text, boss.id));
  }
  for (const achievement of ACHIEVEMENTS) {
    tutorialAchievements.append(
      createCodexItem(
        achievement.name,
        achievement.text,
        achievements.has(achievement.id) ? "erreicht" : "offen",
        achievements.has(achievement.id),
      ),
    );
  }
  trainingBossSelect.innerHTML = "";
  for (const boss of [...BOSSES, FINAL_BOSS]) {
    const option = document.createElement("option");
    option.value = boss.id;
    option.textContent = boss.name;
    trainingBossSelect.append(option);
  }
  updateMainMenuState();
}

function canContinueRun() {
  return Boolean(
    run &&
      match &&
      !match.gameOver &&
      shopScreen.classList.contains("hidden") &&
      perkScreen.classList.contains("hidden") &&
      winnerScreen.classList.contains("hidden"),
  );
}

function updateMainMenuState() {
  continueMenuButton.classList.toggle("hidden", !canContinueRun());
}

function openMainMenu() {
  renderTutorial();
  winnerScreen.classList.add("hidden");
  trainingMenuButton.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function resumeRunFromMenu() {
  if (!canContinueRun()) return;
  startScreen.classList.add("hidden");
  updateHud();
  renderBoard();
  updatePlayerVision();
}

function createCodexItem(name, text, tag, unlocked = true) {
  const item = document.createElement("article");
  item.className = `codex-item ${unlocked ? "" : "locked"}`;
  item.innerHTML = `<div><strong>${name}</strong><span>${tag}</span></div><p>${text}</p>`;
  return item;
}

function createChip(text, type, tooltip) {
  const chip = document.createElement("span");
  chip.className = `chip ${type} has-tooltip`;
  chip.textContent = text;
  chip.dataset.tooltip = tooltip;
  chip.title = tooltip;
  return chip;
}

function getValidColumns() {
  return getOpenColumns().filter((column) => findLandingRow(column, PIECE.NORMAL) !== -1);
}

function getOpenColumns() {
  return Array.from({ length: match.columns }, (_, column) => column).filter((column) => !isColumnBlocked(column));
}

function isColumnBlocked(column) {
  return match.frozenColumns.has(column) || match.sealedColumns.has(column);
}

function isDraw() {
  return getValidColumns().length === 0;
}

function bossActive(id) {
  return match?.boss?.id === id || (match?.boss?.id === "game" && match.activeGameBoss === id);
}

function hasPerk(id) {
  return run?.perks.includes(id);
}

function countPerk(id) {
  return run?.perks.filter((perk) => perk === id).length ?? 0;
}

function collectOwnedCells(owner) {
  const cells = [];
  forEachPiece((piece, row, column) => {
    if (piece.owner === owner) cells.push([row, column]);
  });
  return cells;
}

function forEachPiece(callback) {
  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      if (board[row][column]) callback(board[row][column], row, column);
    }
  }
}

function oppositeOwner(owner) {
  return owner === OWNER.PLAYER ? OWNER.ENEMY : OWNER.PLAYER;
}

function cellKey(row, column) {
  return `${row}:${column}`;
}

function flashRule(text) {
  statusElement.textContent = text;
  document.body.classList.add("glitching");
  window.setTimeout(() => document.body.classList.remove("glitching"), 240);
}

function hideOverlays() {
  startScreen.classList.add("hidden");
  shopScreen.classList.add("hidden");
  perkScreen.classList.add("hidden");
  winnerScreen.classList.add("hidden");
  trainingMenuButton.classList.add("hidden");
}

function playSound(type) {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  audioContext ??= new AudioEngine();
  if (audioContext.state === "suspended") audioContext.resume();
  const tones = {
    start: [180, 260],
    drop: [160, 105],
    combo: [260, 360, 520],
    win: [330, 440, 660],
    lose: [180, 110],
    blocked: [80],
    boss: [70, 92, 110],
  }[type] ?? [200];
  const now = audioContext.currentTime;
  tones.forEach((tone, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = now + index * 0.055;
    oscillator.type = type === "blocked" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(tone, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.22);
  });
}

boardElement.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  handleBoardClick(Number(cell.dataset.row), Number(cell.dataset.column));
});
runButton.addEventListener("click", startRun);
startRunButton.addEventListener("click", startRun);
continueMenuButton.addEventListener("click", resumeRunFromMenu);
trainingButton.addEventListener("click", startTraining);
trainingMenuButton.addEventListener("click", openMainMenu);
newRunButton.addEventListener("click", openMainMenu);
tutorialButton.addEventListener("click", openMainMenu);
shopButton.addEventListener("click", openShop);
nextBattleButton.addEventListener("click", nextBattle);
continueRunButton.addEventListener("click", continueRun);
freezePowerButton.addEventListener("click", () => {
  if (!hasPower("freezeMaster")) return;
  targetingPower = targetingPower === "freeze" ? null : "freeze";
  statusElement.textContent = targetingPower ? "Waehle eine Spalte zum Einfrieren." : "PLAYER ist am Zug";
});
deletePowerButton.addEventListener("click", () => {
  if (!hasPower("deletion")) return;
  targetingPower = targetingPower === "delete" ? null : "delete";
  statusElement.textContent = targetingPower ? "Waehle einen Gegnerstein zum Loeschen." : "PLAYER ist am Zug";
});

renderTutorial();
updateHud();
board = createBoard(BASE_ROWS, BASE_COLUMNS);
renderBoard();
