import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import {
  PublicRoomState,
  Player,
  GameSettings,
  DrawingStroke,
  ChatMessage,
  ServerMessage,
  ClientMessage,
  RoundResultData,
  GameOverData,
} from './src/types';
import { getRandomWord } from './src/data/words';
import { getBotDrawingStrokes } from './src/data/botDrawings';

type RoomPlayer = Player & { ws?: WebSocket };

interface InternalRoom {
  id: string;
  isPrivate: boolean;
  settings: GameSettings;
  players: RoomPlayer[];
  phase: 'LOBBY' | 'STARTING' | 'DRAWING' | 'ROUND_RESULT' | 'GAME_OVER';
  currentRound: number;
  totalRounds: number;
  currentDrawerIndex: number;
  secretWord: string;
  wordCategory: string;
  revealedIndices: Set<number>;
  timeLeft: number;
  timerInterval?: NodeJS.Timeout;
  countdownInterval?: NodeJS.Timeout;
  botIntervals?: NodeJS.Timeout[];
  strokes: DrawingStroke[];
  messages: ChatMessage[];
  roundResults?: RoundResultData;
  gameOverData?: GameOverData;
  countdown: number;
  bannedPlayerIds: Set<string>;
  usedWords: Set<string>;
}

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// In-memory active rooms
const rooms = new Map<string, InternalRoom>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function computeMaskedWord(word: string, revealed: Set<number>): string {
  return word
    .split('')
    .map((ch, idx) => {
      if (ch === ' ') return ' ';
      return revealed.has(idx) ? ch : '_';
    })
    .join(' ');
}

function getPublicState(room: InternalRoom, playerId?: string): PublicRoomState {
  const isDrawer =
    room.currentDrawerIndex >= 0 &&
    room.players[room.currentDrawerIndex] &&
    room.players[room.currentDrawerIndex].id === playerId;

  const thisPlayer = room.players.find((p) => p.id === playerId);
  const playerHasGuessed = thisPlayer?.hasGuessed ?? false;
  const isRevealed =
    isDrawer ||
    playerHasGuessed ||
    room.phase === 'ROUND_RESULT' ||
    room.phase === 'GAME_OVER';

  return {
    roomId: room.id,
    isPrivate: room.isPrivate,
    phase: room.phase,
    settings: room.settings,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      roundScore: p.roundScore,
      isHost: p.isHost,
      isDrawer: p.isDrawer,
      hasGuessed: p.hasGuessed,
      guessOrder: p.guessOrder,
      isReady: p.isReady,
      isBot: p.isBot,
    })),
    currentRound: room.currentRound,
    totalRounds: room.totalRounds,
    currentDrawerId: room.players[room.currentDrawerIndex]?.id || null,
    timeLeft: room.timeLeft,
    maskedWord: computeMaskedWord(room.secretWord, room.revealedIndices),
    secretWordLength: room.secretWord.replace(/\s/g, '').length,
    wordCategory: room.wordCategory,
    secretWord: isRevealed ? room.secretWord : undefined,
    roundResult: room.roundResults,
    gameOver: room.gameOverData,
    strokesCount: room.strokes.length,
  };
}

function broadcastToRoom(room: InternalRoom, message: ServerMessage, excludeWs?: WebSocket) {
  const json = JSON.stringify(message);
  for (const p of room.players) {
    if (p.ws && p.ws.readyState === WebSocket.OPEN && p.ws !== excludeWs) {
      p.ws.send(json);
    }
  }
}

function broadcastRoomState(room: InternalRoom) {
  for (const p of room.players) {
    if (p.ws && p.ws.readyState === WebSocket.OPEN) {
      const publicState = getPublicState(room, p.id);
      p.ws.send(JSON.stringify({ type: 'ROOM_UPDATE', payload: publicState }));
    }
  }
}

function startRoundCountdown(room: InternalRoom) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = undefined;
  }
  if (room.countdownInterval) {
    clearInterval(room.countdownInterval);
    room.countdownInterval = undefined;
  }
  if (room.botIntervals) {
    room.botIntervals.forEach((t) => clearInterval(t));
    room.botIntervals = [];
  }

  // Ensure drawer index is valid
  if (room.players.length === 0) return;
  if (room.currentDrawerIndex >= room.players.length) {
    room.currentDrawerIndex = 0;
  }

  // Set flags on players
  room.players.forEach((p, idx) => {
    p.isDrawer = idx === room.currentDrawerIndex;
    p.hasGuessed = false;
    p.roundScore = 0;
    p.guessOrder = undefined;
  });

  const drawer = room.players[room.currentDrawerIndex];
  if (!drawer) return;

  // Pick word with repetition prevention
  const wordEntry = getRandomWord(room.settings.difficulty, Array.from(room.usedWords));
  room.usedWords.add(wordEntry.word.toUpperCase());
  room.secretWord = wordEntry.word.toUpperCase();
  room.wordCategory = wordEntry.category;
  room.revealedIndices = new Set();
  room.strokes = [];
  room.phase = 'STARTING';
  room.countdown = 3;
  room.timeLeft = room.settings.drawTime;

  // Broadcast clear strokes and countdown
  broadcastToRoom(room, { type: 'STROKES_CLEARED' });
  broadcastRoomState(room);

  let remainingCountdown = 3;
  broadcastToRoom(room, {
    type: 'ROUND_START_COUNTDOWN',
    payload: {
      countdown: remainingCountdown,
      drawerName: drawer.name,
      drawerId: drawer.id,
    },
  });

  room.countdownInterval = setInterval(() => {
    remainingCountdown--;
    if (remainingCountdown >= 0) {
      broadcastToRoom(room, {
        type: 'ROUND_START_COUNTDOWN',
        payload: {
          countdown: remainingCountdown,
          drawerName: drawer.name,
          drawerId: drawer.id,
        },
      });
    }

    if (remainingCountdown <= 0) {
      if (room.countdownInterval) {
        clearInterval(room.countdownInterval);
        room.countdownInterval = undefined;
      }
      setTimeout(() => {
        if (room.phase === 'STARTING') {
          startDrawingPhase(room);
        }
      }, 600);
    }
  }, 1000);
}

function startDrawingPhase(room: InternalRoom) {
  room.phase = 'DRAWING';
  room.timeLeft = room.settings.drawTime;
  broadcastRoomState(room);

  // Setup hints scheduling
  setupWordHints(room);

  // Setup bots (drawing or guessing)
  setupBotBehaviors(room);

  // Start round drawing timer
  room.timerInterval = setInterval(() => {
    room.timeLeft -= 1;
    broadcastToRoom(room, {
      type: 'TIMER_TICK',
      payload: { timeLeft: room.timeLeft },
    });

    // When timer expires, end round
    if (room.timeLeft <= 0) {
      endRound(room);
    }
  }, 1000);
}

function setupWordHints(room: InternalRoom) {
  const hintsCount = room.settings.hintsCount;
  if (hintsCount <= 0) return;

  const validIndices: number[] = [];
  for (let i = 0; i < room.secretWord.length; i++) {
    if (room.secretWord[i] !== ' ') {
      validIndices.push(i);
    }
  }

  if (validIndices.length <= 2) return;

  // Calculate reveal times: e.g. at 60%, 40%, 20% time left
  const step = room.settings.drawTime / (hintsCount + 1);
  for (let h = 1; h <= hintsCount; h++) {
    const triggerTime = Math.round(room.settings.drawTime - step * h);
    setTimeout(() => {
      if (room.phase !== 'DRAWING') return;

      const unrevealed = validIndices.filter((idx) => !room.revealedIndices.has(idx));
      if (unrevealed.length > 1) {
        const randomIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        room.revealedIndices.add(randomIdx);
        broadcastRoomState(room);
      }
    }, (room.settings.drawTime - triggerTime) * 1000);
  }
}

function endRound(room: InternalRoom) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = undefined;
  }
  if (room.countdownInterval) {
    clearInterval(room.countdownInterval);
    room.countdownInterval = undefined;
  }
  if (room.botIntervals) {
    room.botIntervals.forEach((t) => clearInterval(t));
    room.botIntervals = [];
  }

  room.phase = 'ROUND_RESULT';

  // Calculate drawer bonus points based on correct guessers
  const drawer = room.players[room.currentDrawerIndex];
  const guessers = room.players.filter((p) => p.hasGuessed && !p.isDrawer);

  if (drawer && guessers.length > 0) {
    const drawerPoints = guessers.length * 100;
    drawer.score += drawerPoints;
    drawer.roundScore += drawerPoints;
  }

  // Compile round result scores
  const scoresGained = room.players
    .filter((p) => p.roundScore > 0)
    .map((p) => ({
      playerId: p.id,
      playerName: p.name,
      points: p.roundScore,
      avatar: p.avatar,
      isDrawer: p.id === drawer?.id,
    }))
    .sort((a, b) => b.points - a.points);

  room.roundResults = {
    word: room.secretWord,
    scoresGained,
  };

  broadcastRoomState(room);

  // After 5.5 seconds, advance to next drawer or finish game
  setTimeout(() => {
    advanceGame(room);
  }, 5500);
}

function advanceGame(room: InternalRoom) {
  if (room.players.length < 2) {
    room.phase = 'LOBBY';
    broadcastRoomState(room);
    return;
  }

  room.currentDrawerIndex += 1;

  // Check if all players took a turn in current round
  if (room.currentDrawerIndex >= room.players.length) {
    room.currentDrawerIndex = 0;
    room.currentRound += 1;
  }

  if (room.currentRound > room.totalRounds) {
    // Game Over!
    endGame(room);
  } else {
    // Next turn
    startRoundCountdown(room);
  }
}

function endGame(room: InternalRoom) {
  room.phase = 'GAME_OVER';
  const sorted = [...room.players].sort((a, b) => b.score - a.score);

  room.gameOverData = {
    podium: sorted.slice(0, 3).map((p, idx) => ({
      rank: idx + 1,
      playerId: p.id,
      playerName: p.name,
      score: p.score,
      avatar: p.avatar,
    })),
  };

  broadcastRoomState(room);
}

function setupBotBehaviors(room: InternalRoom) {
  const bots = room.players.filter((p) => p.isBot);
  if (bots.length === 0) return;

  const currentDrawer = room.players[room.currentDrawerIndex];

  // If a bot is the drawer, generate progressive, recognizable strokes
  if (currentDrawer && currentDrawer.isBot) {
    const strokes = getBotDrawingStrokes(room.secretWord);
    let strokeIdx = 0;
    const intervalMs = Math.max(1200, Math.floor((room.settings.drawTime * 700) / Math.max(1, strokes.length)));

    const drawTimer = setInterval(() => {
      if (room.phase !== 'DRAWING' || strokeIdx >= strokes.length) {
        clearInterval(drawTimer);
        return;
      }

      const nextStroke = strokes[strokeIdx++];
      room.strokes.push(nextStroke);
      broadcastToRoom(room, { type: 'STROKE_ADDED', payload: nextStroke });
    }, intervalMs);

    room.botIntervals = room.botIntervals || [];
    room.botIntervals.push(drawTimer);
  }

  // If bots are guessers, simulate realistic guessing behavior
  bots.forEach((bot) => {
    if (bot.id === currentDrawer?.id) return;

    const guessDelay = (14 + Math.random() * (room.settings.drawTime - 18)) * 1000;
    const botTimer = setTimeout(() => {
      if (room.phase !== 'DRAWING' || bot.hasGuessed) return;
      handlePlayerGuess(room, bot, room.secretWord);
    }, Math.max(10000, guessDelay));

    room.botIntervals = room.botIntervals || [];
    room.botIntervals.push(botTimer as unknown as NodeJS.Timeout);
  });
}

function checkDrawerLeak(text: string, secretWord: string): boolean {
  const cleanSecret = secretWord.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleanSecret) return false;
  const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Direct substring
  if (cleanText.includes(cleanSecret)) return true;

  // Spaced variations (e.g., "a p p l e")
  const spacedPattern = cleanSecret.split('').join('\\s*');
  if (new RegExp(spacedPattern, 'i').test(text)) return true;

  // Word token fuzzy check
  const words = text.toUpperCase().split(/[^A-Z0-9]+/);
  for (const w of words) {
    if (w === cleanSecret) return true;
    if (cleanSecret.length >= 4 && levenshtein(w, cleanSecret) <= 1) return true;
  }

  return false;
}

function handlePlayerGuess(room: InternalRoom, player: RoomPlayer, text: string) {
  if (room.phase !== 'DRAWING') return;

  // Drawer Chat Handling (Drawer can chat!)
  if (player.isDrawer) {
    const isLeak = checkDrawerLeak(text, room.secretWord);

    const drawerMsg: ChatMessage = {
      id: String(Date.now()),
      playerId: player.id,
      playerName: player.name,
      text: text,
      type: 'normal',
      timestamp: Date.now(),
      avatar: player.avatar,
      drawerSecret: isLeak,
    };

    if (isLeak) {
      // Send ONLY to players who already guessed or the drawer, styled in green!
      for (const p of room.players) {
        if (p.isDrawer || p.hasGuessed) {
          if (p.ws && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'CHAT_MESSAGE', payload: drawerMsg }));
          }
        }
      }
    } else {
      // Normal drawer chat visible to everyone!
      room.messages.push(drawerMsg);
      broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: drawerMsg });
    }
    return;
  }

  // Already guessed
  if (player.hasGuessed) {
    const msg: ChatMessage = {
      id: String(Date.now()),
      playerId: player.id,
      playerName: player.name,
      text: text,
      type: 'normal',
      timestamp: Date.now(),
      avatar: player.avatar,
    };
    broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: msg });
    return;
  }

  const cleanGuess = text.trim().toUpperCase();
  const targetWord = room.secretWord.trim().toUpperCase();

  if (cleanGuess === targetWord) {
    // Correct Guess!
    player.hasGuessed = true;
    const guessedCount = room.players.filter((p) => p.hasGuessed && !p.isDrawer).length;
    player.guessOrder = guessedCount;

    // Earlier guesses get more points: +600 down to +200 min
    const pointsGained = Math.max(200, 600 - (guessedCount - 1) * 100);
    player.score += pointsGained;
    player.roundScore = pointsGained;

    // Send private confirmation to the guesser
    if (player.ws) {
      player.ws.send(
        JSON.stringify({
          type: 'CORRECT_GUESS_PRIVATE',
          payload: { word: room.secretWord, points: pointsGained },
        })
      );
    }

    // Broadcast public celebration announcement without revealing secret word
    const publicMsg: ChatMessage = {
      id: String(Date.now()),
      playerId: player.id,
      playerName: player.name,
      text: 'has guessed the word!',
      type: 'correct',
      timestamp: Date.now(),
      avatar: player.avatar,
    };
    room.messages.push(publicMsg);
    broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: publicMsg });

    // Update scoreboard
    broadcastRoomState(room);

    // If all non-drawers have guessed, end round early!
    const nonDrawers = room.players.filter((p) => !p.isDrawer);
    const allGuessed = nonDrawers.length > 0 && nonDrawers.every((p) => p.hasGuessed);
    if (allGuessed) {
      endRound(room);
    }
  } else {
    // Check if close
    const isClose =
      cleanGuess.length >= 3 &&
      (targetWord.includes(cleanGuess) ||
        cleanGuess.includes(targetWord) ||
        levenshtein(cleanGuess, targetWord) <= 1);

    if (isClose && player.ws) {
      player.ws.send(
        JSON.stringify({
          type: 'CHAT_MESSAGE',
          payload: {
            id: String(Date.now()),
            playerId: 'system',
            playerName: 'System',
            text: `"${text}" is super close!`,
            type: 'close',
            timestamp: Date.now(),
          },
        })
      );
    }

    // Normal chat message
    const msg: ChatMessage = {
      id: String(Date.now()),
      playerId: player.id,
      playerName: player.name,
      text: text,
      type: 'normal',
      timestamp: Date.now(),
      avatar: player.avatar,
    };
    room.messages.push(msg);
    broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: msg });
  }
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// WebSocket Connection Handlers
wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let currentPlayerId: string | null = null;

  ws.on('message', (raw: string) => {
    try {
      const data: ClientMessage = JSON.parse(raw.toString());

      if (data.type === 'JOIN_LOBBY') {
        const { name, avatar, roomId, isPrivate } = data.payload;
        let room: InternalRoom | undefined;

        if (roomId) {
          const upperId = roomId.trim().toUpperCase();
          room = rooms.get(upperId);
          if (!room) {
            ws.send(
              JSON.stringify({
                type: 'ERROR',
                payload: { message: `Room "${upperId}" does not exist.` },
              })
            );
            return;
          }

          // Check if banned
          if (room.bannedPlayerIds && currentPlayerId && room.bannedPlayerIds.has(currentPlayerId)) {
            ws.send(
              JSON.stringify({
                type: 'BANNED',
                payload: { message: 'You have been banned from this lobby.' },
              })
            );
            return;
          }

          // Enforce max player limit (real + bots combined)
          if (room.players.length >= room.settings.maxPlayers) {
            ws.send(
              JSON.stringify({
                type: 'ERROR',
                payload: { message: 'Lobby is full. Try another lobby.' },
              })
            );
            return;
          }
        } else if (isPrivate) {
          const newCode = generateRoomCode();
          room = {
            id: newCode,
            isPrivate: true,
            settings: {
              maxPlayers: 8,
              rounds: 3,
              drawTime: 80,
              hintsCount: 2,
              difficulty: 'normal',
            },
            players: [],
            phase: 'LOBBY',
            currentRound: 1,
            totalRounds: 3,
            currentDrawerIndex: 0,
            secretWord: '',
            wordCategory: '',
            revealedIndices: new Set(),
            timeLeft: 80,
            strokes: [],
            messages: [],
            countdown: 3,
            bannedPlayerIds: new Set(),
            usedWords: new Set(),
          };
          rooms.set(newCode, room);
        } else {
          // Public matchmaking: find open room with space
          for (const r of rooms.values()) {
            if (
              !r.isPrivate &&
              r.phase === 'LOBBY' &&
              r.players.length < r.settings.maxPlayers
            ) {
              room = r;
              break;
            }
          }

          if (!room) {
            // Create a public room
            const newCode = generateRoomCode();
            room = {
              id: newCode,
              isPrivate: false,
              settings: {
                maxPlayers: 8,
                rounds: 3,
                drawTime: 80,
                hintsCount: 2,
                difficulty: 'normal',
              },
              players: [],
              phase: 'LOBBY',
              currentRound: 1,
              totalRounds: 3,
              currentDrawerIndex: 0,
              secretWord: '',
              wordCategory: '',
              revealedIndices: new Set(),
              timeLeft: 80,
              strokes: [],
              messages: [],
              countdown: 3,
              bannedPlayerIds: new Set(),
              usedWords: new Set(),
            };
            rooms.set(newCode, room);
          }
        }

        currentRoomId = room.id;
        currentPlayerId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        const isFirst = room.players.length === 0;
        const newPlayer: Player & { ws?: WebSocket } = {
          id: currentPlayerId,
          name: name || `Player ${room.players.length + 1}`,
          avatar: avatar,
          score: 0,
          roundScore: 0,
          isHost: isFirst,
          isDrawer: false,
          hasGuessed: false,
          isReady: true,
          ws,
        };

        room.players.push(newPlayer);

        // Notify client with full initial state
        const initState: ServerMessage = {
          type: 'INIT_STATE',
          payload: {
            playerId: currentPlayerId,
            state: getPublicState(room, currentPlayerId),
            strokes: room.strokes,
            messages: room.messages,
          },
        };
        ws.send(JSON.stringify(initState));

        // Announce in chat and update everyone
        const joinMsg: ChatMessage = {
          id: String(Date.now()),
          playerId: 'system',
          playerName: 'System',
          text: `${newPlayer.name} joined the room!`,
          type: 'system',
          timestamp: Date.now(),
        };
        room.messages.push(joinMsg);
        broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: joinMsg });
        broadcastRoomState(room);
        return;
      }

      if (!currentRoomId || !currentPlayerId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      const player = room.players.find((p) => p.id === currentPlayerId);
      if (!player) return;

      if (data.type === 'UPDATE_SETTINGS' && player.isHost) {
        const payload = data.payload;
        // Don't allow maxPlayers lower than current player count
        if (payload.maxPlayers && payload.maxPlayers < room.players.length) {
          payload.maxPlayers = room.players.length;
        }
        room.settings = { ...room.settings, ...payload };
        room.totalRounds = room.settings.rounds;
        broadcastRoomState(room);
      } else if (data.type === 'ADD_BOT') {
        // Enforce player limit
        if (room.players.length >= room.settings.maxPlayers) {
          ws.send(
            JSON.stringify({
              type: 'ERROR',
              payload: { message: "Lobby is full — can't add more bots." },
            })
          );
          return;
        }

        const botNames = ['PixelPip', 'DoodleDan', 'SketchySam', 'ArtieBot', 'Chalky', 'Botty'];
        const chosen = botNames[room.players.length % botNames.length];
        const botId = `bot_${Date.now()}`;

        // Distinct colors for bots with "V" badge
        const botColors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];
        const currentBotsCount = room.players.filter((p) => p.isBot).length;
        const botColor = botColors[currentBotsCount % botColors.length];

        const botPlayer: Player = {
          id: botId,
          name: chosen,
          avatar: {
            skinColor: '#fde047',
            eyes: 'normal',
            mouth: 'smile',
            hair: 'bald',
            hairColor: '#000000',
            accessory: 'none',
            bodyColor: botColor,
          },
          score: 0,
          roundScore: 0,
          isHost: false,
          isDrawer: false,
          hasGuessed: false,
          isReady: true,
          isBot: true,
        };
        room.players.push(botPlayer);
        broadcastRoomState(room);
      } else if (data.type === 'REMOVE_BOT' || (data.type === 'REMOVE_PLAYER' && player.isHost)) {
        if (!player.isHost) return;
        const targetId = 'botId' in data.payload ? data.payload.botId : data.payload.playerId;
        const botIdx = room.players.findIndex((p) => p.id === targetId && p.isBot);
        if (botIdx !== -1) {
          room.players.splice(botIdx, 1);
          broadcastRoomState(room);
        }
      } else if (data.type === 'KICK_PLAYER') {
        // Server authority check: only host can kick
        if (!player.isHost) return;
        const target = room.players.find((p) => p.id === data.payload.targetPlayerId);
        if (target && !target.isHost) {
          if (target.ws && target.ws.readyState === WebSocket.OPEN) {
            target.ws.send(
              JSON.stringify({
                type: 'KICKED',
                payload: { message: 'You were kicked from the room by the host.' },
              })
            );
          }
          handlePlayerDisconnect(room, target);
        }
      } else if (data.type === 'BAN_PLAYER') {
        // Server authority check: only host can ban
        if (!player.isHost) return;
        const target = room.players.find((p) => p.id === data.payload.targetPlayerId);
        if (target && !target.isHost) {
          room.bannedPlayerIds.add(target.id);
          if (target.ws && target.ws.readyState === WebSocket.OPEN) {
            target.ws.send(
              JSON.stringify({
                type: 'BANNED',
                payload: { message: 'You have been banned from this lobby.' },
              })
            );
          }
          handlePlayerDisconnect(room, target);
        }
      } else if (data.type === 'START_GAME' && player.isHost) {
        if (room.players.length >= 2) {
          room.currentRound = 1;
          room.currentDrawerIndex = 0;
          startRoundCountdown(room);
        }
      } else if (data.type === 'DRAW_STROKE') {
        if (player.isDrawer && room.phase === 'DRAWING') {
          room.strokes.push(data.payload);
          broadcastToRoom(room, { type: 'STROKE_ADDED', payload: data.payload }, ws);
        }
      } else if (data.type === 'DRAW_UNDO') {
        if (player.isDrawer && room.phase === 'DRAWING' && room.strokes.length > 0) {
          const removed = room.strokes.pop();
          if (removed) {
            broadcastToRoom(room, {
              type: 'STROKE_UNDONE',
              payload: { strokeId: removed.id },
            });
          }
        }
      } else if (data.type === 'DRAW_CLEAR') {
        if (player.isDrawer && room.phase === 'DRAWING') {
          room.strokes = [];
          broadcastToRoom(room, { type: 'STROKES_CLEARED' });
        }
      } else if (data.type === 'SEND_GUESS') {
        handlePlayerGuess(room, player, data.payload.text);
      } else if (data.type === 'PLAY_AGAIN' && player.isHost) {
        room.phase = 'LOBBY';
        room.currentRound = 1;
        room.currentDrawerIndex = 0;
        room.strokes = [];
        room.gameOverData = undefined;
        room.roundResults = undefined;
        for (const p of room.players) {
          p.score = 0;
          p.roundScore = 0;
          p.hasGuessed = false;
        }
        broadcastRoomState(room);
      } else if (data.type === 'LEAVE_ROOM') {
        handlePlayerDisconnect(room, player);
      }
    } catch (err) {
      console.error('WS Error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && currentPlayerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const player = room.players.find((p) => p.id === currentPlayerId);
        if (player) {
          handlePlayerDisconnect(room, player);
        }
      }
    }
  });
});

function handlePlayerDisconnect(room: InternalRoom, player: RoomPlayer) {
  const index = room.players.findIndex((p) => p.id === player.id);
  if (index === -1) return;

  const wasHost = player.isHost;
  const wasDrawer = player.isDrawer;

  room.players.splice(index, 1);

  // If no players remain, clean up room
  if (room.players.length === 0) {
    if (room.timerInterval) clearInterval(room.timerInterval);
    if (room.countdownInterval) clearInterval(room.countdownInterval);
    if (room.botIntervals) room.botIntervals.forEach((t) => clearInterval(t));
    rooms.delete(room.id);
    return;
  }

  // Transfer host if host left
  if (wasHost && room.players.length > 0) {
    room.players[0].isHost = true;
  }

  // If only 1 player remains in the game during match, safely return to lobby
  if (room.players.length < 2 && room.phase !== 'LOBBY') {
    if (room.timerInterval) clearInterval(room.timerInterval);
    if (room.countdownInterval) clearInterval(room.countdownInterval);
    if (room.botIntervals) room.botIntervals.forEach((t) => clearInterval(t));
    room.phase = 'LOBBY';
    room.strokes = [];
    room.players.forEach((p) => {
      p.isDrawer = false;
      p.hasGuessed = false;
    });
    broadcastRoomState(room);
  } else if (room.phase === 'DRAWING' || room.phase === 'STARTING') {
    if (wasDrawer) {
      // Current drawer left: advance to next valid drawer cleanly
      if (room.timerInterval) clearInterval(room.timerInterval);
      if (room.countdownInterval) clearInterval(room.countdownInterval);
      if (room.botIntervals) room.botIntervals.forEach((t) => clearInterval(t));
      room.currentDrawerIndex = room.currentDrawerIndex % room.players.length;
      startRoundCountdown(room);
    } else {
      if (index < room.currentDrawerIndex) {
        room.currentDrawerIndex = Math.max(0, room.currentDrawerIndex - 1);
      }
      broadcastRoomState(room);
    }
  } else {
    broadcastRoomState(room);
  }

  // Announce left
  const leaveMsg: ChatMessage = {
    id: String(Date.now()),
    playerId: 'system',
    playerName: 'System',
    text: `${player.name} left the room.`,
    type: 'system',
    timestamp: Date.now(),
  };
  broadcastToRoom(room, { type: 'CHAT_MESSAGE', payload: leaveMsg });
}

// Start HTTP server and mount Vite middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Scratch Up] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
