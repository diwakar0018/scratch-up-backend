export interface AvatarConfig {
  skinColor: string;
  eyes: 'happy' | 'normal' | 'glasses' | 'wink' | 'cool' | 'star' | 'dizzy';
  mouth: 'smile' | 'grin' | 'open' | 'tongue' | 'mustache' | 'surprise';
  hair: 'bald' | 'short' | 'spiky' | 'curly' | 'ponytail' | 'cap' | 'beanie';
  hairColor: string;
  accessory: 'none' | 'blush' | 'bandana' | 'headset' | 'crown' | 'monocle' | 'artist_beret';
  bodyColor: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: AvatarConfig;
  score: number;
  roundScore: number;
  isHost: boolean;
  isDrawer: boolean;
  hasGuessed: boolean;
  guessOrder?: number;
  isReady: boolean;
  isBot?: boolean;
}

export interface GameSettings {
  maxPlayers: number;
  rounds: number;
  drawTime: number; // 30, 60, 80, 120 seconds
  hintsCount: number; // 0, 1, 2, 3
  difficulty: 'easy' | 'normal' | 'hard' | 'mixed';
}

export interface StrokePoint {
  x: number; // Normalized 0..1 coordinates
  y: number;
}

export interface DrawingStroke {
  id: string;
  tool: 'pencil' | 'eraser' | 'fill';
  color: string;
  size: number;
  points: StrokePoint[];
}

export type ChatMessageType = 'normal' | 'correct' | 'system' | 'close' | 'drawer_warn';

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  type: ChatMessageType;
  timestamp: number;
  avatar?: AvatarConfig;
  drawerSecret?: boolean; // When true, drawer typed secret word or leak; only visible in green to players who already guessed
}

export type GamePhase = 'LOBBY' | 'STARTING' | 'DRAWING' | 'ROUND_RESULT' | 'GAME_OVER';

export interface RoundResultData {
  word: string;
  scoresGained: {
    playerId: string;
    playerName: string;
    points: number;
    avatar: AvatarConfig;
    isDrawer?: boolean;
  }[];
}

export interface GameOverData {
  podium: {
    rank: number;
    playerId: string;
    playerName: string;
    score: number;
    avatar: AvatarConfig;
  }[];
}

export interface PublicRoomState {
  roomId: string;
  isPrivate: boolean;
  phase: GamePhase;
  settings: GameSettings;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  currentDrawerId: string | null;
  timeLeft: number;
  maskedWord: string; // e.g., "_ _ _" or "_ A _ T"
  secretWordLength: number;
  wordCategory?: string;
  // If current player is the drawer, or round is over/revealed
  secretWord?: string;
  roundResult?: RoundResultData;
  gameOver?: GameOverData;
  strokesCount: number;
}

// WebSocket Event Types
export type ClientMessage =
  | { type: 'JOIN_LOBBY'; payload: { name: string; avatar: AvatarConfig; roomId?: string; isPrivate?: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'ADD_BOT'; payload?: {} }
  | { type: 'REMOVE_BOT'; payload: { botId: string } }
  | { type: 'KICK_PLAYER'; payload: { targetPlayerId: string } }
  | { type: 'BAN_PLAYER'; payload: { targetPlayerId: string } }
  | { type: 'REMOVE_PLAYER'; payload: { playerId: string } }
  | { type: 'START_GAME'; payload?: {} }
  | { type: 'DRAW_STROKE'; payload: DrawingStroke }
  | { type: 'DRAW_CLEAR'; payload?: {} }
  | { type: 'DRAW_UNDO'; payload?: {} }
  | { type: 'SEND_GUESS'; payload: { text: string } }
  | { type: 'PLAY_AGAIN'; payload?: {} }
  | { type: 'LEAVE_ROOM'; payload?: {} };

export type ServerMessage =
  | { type: 'INIT_STATE'; payload: { playerId: string; state: PublicRoomState; strokes: DrawingStroke[]; messages: ChatMessage[] } }
  | { type: 'ROOM_UPDATE'; payload: PublicRoomState }
  | { type: 'TIMER_TICK'; payload: { timeLeft: number } }
  | { type: 'STROKE_ADDED'; payload: DrawingStroke }
  | { type: 'STROKES_CLEARED' }
  | { type: 'STROKE_UNDONE'; payload: { strokeId: string } }
  | { type: 'CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CORRECT_GUESS_PRIVATE'; payload: { word: string; points: number } }
  | { type: 'ROUND_START_COUNTDOWN'; payload: { countdown: number; drawerName: string; drawerId: string } }
  | { type: 'KICKED'; payload: { message: string } }
  | { type: 'BANNED'; payload: { message: string } }
  | { type: 'ERROR'; payload: { message: string } };
