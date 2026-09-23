export interface WordEntry {
  word: string;
  category: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

export const WORDS_DATABASE: WordEntry[] = [
  // ==================== ANIMALS ====================
  { word: "CAT", category: "Animals", difficulty: "easy" },
  { word: "DOG", category: "Animals", difficulty: "easy" },
  { word: "ANT", category: "Animals", difficulty: "easy" },
  { word: "FISH", category: "Animals", difficulty: "easy" },
  { word: "BIRD", category: "Animals", difficulty: "easy" },
  { word: "DUCK", category: "Animals", difficulty: "easy" },
  { word: "FROG", category: "Animals", difficulty: "easy" },
  { word: "PIG", category: "Animals", difficulty: "easy" },
  { word: "COW", category: "Animals", difficulty: "easy" },
  { word: "BEAR", category: "Animals", difficulty: "easy" },
  { word: "LION", category: "Animals", difficulty: "easy" },
  { word: "BEE", category: "Animals", difficulty: "easy" },
  { word: "BAT", category: "Animals", difficulty: "easy" },
  { word: "SHEEP", category: "Animals", difficulty: "easy" },
  { word: "MOUSE", category: "Animals", difficulty: "easy" },
  { word: "SNAKE", category: "Animals", difficulty: "easy" },
  { word: "FOX", category: "Animals", difficulty: "easy" },
  { word: "RABBIT", category: "Animals", difficulty: "easy" },
  { word: "DEER", category: "Animals", difficulty: "easy" },
  { word: "HORSE", category: "Animals", difficulty: "easy" },
  { word: "MONKEY", category: "Animals", difficulty: "easy" },
  { word: "TIGER", category: "Animals", difficulty: "normal" },
  { word: "ELEPHANT", category: "Animals", difficulty: "normal" },
  { word: "PENGUIN", category: "Animals", difficulty: "normal" },
  { word: "GIRAFFE", category: "Animals", difficulty: "normal" },
  { word: "CROCODILE", category: "Animals", difficulty: "normal" },
  { word: "SHARK", category: "Animals", difficulty: "normal" },
  { word: "WHALE", category: "Animals", difficulty: "normal" },
  { word: "OCTOPUS", category: "Animals", difficulty: "normal" },
  { word: "DOLPHIN", category: "Animals", difficulty: "normal" },
  { word: "KANGAROO", category: "Animals", difficulty: "normal" },
  { word: "SPIDER", category: "Animals", difficulty: "normal" },
  { word: "BUTTERFLY", category: "Animals", difficulty: "normal" },
  { word: "TURTLE", category: "Animals", difficulty: "normal" },
  { word: "CHAMELEON", category: "Animals", difficulty: "hard" },
  { word: "HEDGEHOG", category: "Animals", difficulty: "hard" },
  { word: "FLAMINGO", category: "Animals", difficulty: "hard" },
  { word: "PLATYPUS", category: "Animals", difficulty: "hard" },
  { word: "JELLYFISH", category: "Animals", difficulty: "normal" },
  { word: "SEAHORSE", category: "Animals", difficulty: "normal" },
  { word: "SQUIRREL", category: "Animals", difficulty: "normal" },

  // ==================== FOOD ====================
  { word: "PIZZA", category: "Food", difficulty: "easy" },
  { word: "BURGER", category: "Food", difficulty: "easy" },
  { word: "APPLE", category: "Food", difficulty: "easy" },
  { word: "BANANA", category: "Food", difficulty: "easy" },
  { word: "CAKE", category: "Food", difficulty: "easy" },
  { word: "ICE CREAM", category: "Food", difficulty: "easy" },
  { word: "SANDWICH", category: "Food", difficulty: "easy" },
  { word: "FRIES", category: "Food", difficulty: "easy" },
  { word: "DONUT", category: "Food", difficulty: "easy" },
  { word: "WATERMELON", category: "Food", difficulty: "easy" },
  { word: "POPCORN", category: "Food", difficulty: "easy" },
  { word: "NOODLES", category: "Food", difficulty: "easy" },
  { word: "CHOCOLATE", category: "Food", difficulty: "easy" },
  { word: "EGG", category: "Food", difficulty: "easy" },
  { word: "MILK", category: "Food", difficulty: "easy" },
  { word: "BREAD", category: "Food", difficulty: "easy" },
  { word: "CHERRY", category: "Food", difficulty: "easy" },
  { word: "COOKIE", category: "Food", difficulty: "easy" },
  { word: "LEMON", category: "Food", difficulty: "easy" },
  { word: "CANDY", category: "Food", difficulty: "easy" },
  { word: "GRAPES", category: "Food", difficulty: "easy" },
  { word: "CARROT", category: "Food", difficulty: "easy" },
  { word: "PANCAKE", category: "Food", difficulty: "normal" },
  { word: "WAFFLE", category: "Food", difficulty: "normal" },
  { word: "SUSHI", category: "Food", difficulty: "normal" },
  { word: "TACO", category: "Food", difficulty: "normal" },
  { word: "HOT DOG", category: "Food", difficulty: "easy" },
  { word: "CUPCAKE", category: "Food", difficulty: "normal" },
  { word: "STRAWBERRY", category: "Food", difficulty: "normal" },
  { word: "PINEAPPLE", category: "Food", difficulty: "normal" },
  { word: "AVOCADO", category: "Food", difficulty: "normal" },
  { word: "CROISSANT", category: "Food", difficulty: "hard" },
  { word: "SPAGHETTI", category: "Food", difficulty: "normal" },

  // ==================== OBJECTS ====================
  { word: "PHONE", category: "Objects", difficulty: "easy" },
  { word: "CHAIR", category: "Objects", difficulty: "easy" },
  { word: "TABLE", category: "Objects", difficulty: "easy" },
  { word: "UMBRELLA", category: "Objects", difficulty: "easy" },
  { word: "CAMERA", category: "Objects", difficulty: "easy" },
  { word: "GUITAR", category: "Objects", difficulty: "easy" },
  { word: "CLOCK", category: "Objects", difficulty: "easy" },
  { word: "BOOK", category: "Objects", difficulty: "easy" },
  { word: "PENCIL", category: "Objects", difficulty: "easy" },
  { word: "BACKPACK", category: "Objects", difficulty: "easy" },
  { word: "LAMP", category: "Objects", difficulty: "easy" },
  { word: "BALL", category: "Objects", difficulty: "easy" },
  { word: "BED", category: "Objects", difficulty: "easy" },
  { word: "SHOE", category: "Objects", difficulty: "easy" },
  { word: "DOOR", category: "Objects", difficulty: "easy" },
  { word: "HAT", category: "Objects", difficulty: "easy" },
  { word: "RING", category: "Objects", difficulty: "easy" },
  { word: "KEY", category: "Objects", difficulty: "easy" },
  { word: "CUP", category: "Objects", difficulty: "easy" },
  { word: "BOX", category: "Objects", difficulty: "easy" },
  { word: "FORK", category: "Objects", difficulty: "easy" },
  { word: "SPOON", category: "Objects", difficulty: "easy" },
  { word: "PEN", category: "Objects", difficulty: "easy" },
  { word: "BELL", category: "Objects", difficulty: "easy" },
  { word: "SCISSORS", category: "Objects", difficulty: "normal" },
  { word: "FLASHLIGHT", category: "Objects", difficulty: "normal" },
  { word: "TELESCOPE", category: "Objects", difficulty: "normal" },
  { word: "HOURGLASS", category: "Objects", difficulty: "hard" },
  { word: "BOOMERANG", category: "Objects", difficulty: "hard" },
  { word: "KALEIDOSCOPE", category: "Objects", difficulty: "hard" },
  { word: "MIRROR", category: "Objects", difficulty: "easy" },
  { word: "CANDLE", category: "Objects", difficulty: "easy" },
  { word: "MAGNET", category: "Objects", difficulty: "normal" },
  { word: "BALLOON", category: "Objects", difficulty: "easy" },

  // ==================== VEHICLES ====================
  { word: "CAR", category: "Vehicles", difficulty: "easy" },
  { word: "BUS", category: "Vehicles", difficulty: "easy" },
  { word: "TRAIN", category: "Vehicles", difficulty: "easy" },
  { word: "AIRPLANE", category: "Vehicles", difficulty: "easy" },
  { word: "HELICOPTER", category: "Vehicles", difficulty: "normal" },
  { word: "BOAT", category: "Vehicles", difficulty: "easy" },
  { word: "BICYCLE", category: "Vehicles", difficulty: "normal" },
  { word: "MOTORCYCLE", category: "Vehicles", difficulty: "normal" },
  { word: "ROCKET", category: "Vehicles", difficulty: "easy" },
  { word: "TRACTOR", category: "Vehicles", difficulty: "normal" },
  { word: "SUBMARINE", category: "Vehicles", difficulty: "normal" },
  { word: "SKATEBOARD", category: "Vehicles", difficulty: "normal" },
  { word: "SCOOTER", category: "Vehicles", difficulty: "easy" },
  { word: "AMBULANCE", category: "Vehicles", difficulty: "normal" },
  { word: "FIRETRUCK", category: "Vehicles", difficulty: "normal" },
  { word: "SPACESHIP", category: "Vehicles", difficulty: "normal" },
  { word: "HOT AIR BALLOON", category: "Vehicles", difficulty: "hard" },

  // ==================== NATURE ====================
  { word: "SUN", category: "Nature", difficulty: "easy" },
  { word: "MOON", category: "Nature", difficulty: "easy" },
  { word: "STAR", category: "Nature", difficulty: "easy" },
  { word: "TREE", category: "Nature", difficulty: "easy" },
  { word: "FLOWER", category: "Nature", difficulty: "easy" },
  { word: "MOUNTAIN", category: "Nature", difficulty: "easy" },
  { word: "CLOUD", category: "Nature", difficulty: "easy" },
  { word: "RAIN", category: "Nature", difficulty: "easy" },
  { word: "RAINBOW", category: "Nature", difficulty: "easy" },
  { word: "VOLCANO", category: "Nature", difficulty: "normal" },
  { word: "RIVER", category: "Nature", difficulty: "easy" },
  { word: "ISLAND", category: "Nature", difficulty: "easy" },
  { word: "WATERFALL", category: "Nature", difficulty: "normal" },
  { word: "LIGHTNING", category: "Nature", difficulty: "normal" },
  { word: "SNOWMAN", category: "Nature", difficulty: "easy" },
  { word: "TORNADO", category: "Nature", difficulty: "normal" },
  { word: "DESERT", category: "Nature", difficulty: "normal" },
  { word: "FOREST", category: "Nature", difficulty: "normal" },
  { word: "CACTUS", category: "Nature", difficulty: "easy" },
  { word: "FIRE", category: "Nature", difficulty: "easy" },

  // ==================== PLACES ====================
  { word: "SCHOOL", category: "Places", difficulty: "normal" },
  { word: "HOSPITAL", category: "Places", difficulty: "normal" },
  { word: "CASTLE", category: "Places", difficulty: "normal" },
  { word: "HOUSE", category: "Places", difficulty: "easy" },
  { word: "AIRPORT", category: "Places", difficulty: "normal" },
  { word: "BEACH", category: "Places", difficulty: "easy" },
  { word: "PARK", category: "Places", difficulty: "easy" },
  { word: "RESTAURANT", category: "Places", difficulty: "normal" },
  { word: "LIBRARY", category: "Places", difficulty: "normal" },
  { word: "FACTORY", category: "Places", difficulty: "normal" },
  { word: "LIGHTHOUSE", category: "Places", difficulty: "normal" },
  { word: "PYRAMID", category: "Places", difficulty: "normal" },
  { word: "CIRCUS", category: "Places", difficulty: "normal" },
  { word: "FARM", category: "Places", difficulty: "easy" },
  { word: "MUSEUM", category: "Places", difficulty: "normal" },
  { word: "AQUARIUM", category: "Places", difficulty: "hard" },

  // ==================== ACTIONS ====================
  { word: "RUNNING", category: "Actions", difficulty: "easy" },
  { word: "JUMPING", category: "Actions", difficulty: "easy" },
  { word: "SLEEPING", category: "Actions", difficulty: "easy" },
  { word: "DANCING", category: "Actions", difficulty: "easy" },
  { word: "SWIMMING", category: "Actions", difficulty: "easy" },
  { word: "FLYING", category: "Actions", difficulty: "easy" },
  { word: "EATING", category: "Actions", difficulty: "easy" },
  { word: "DRINKING", category: "Actions", difficulty: "easy" },
  { word: "LAUGHING", category: "Actions", difficulty: "easy" },
  { word: "CRYING", category: "Actions", difficulty: "easy" },
  { word: "COOKING", category: "Actions", difficulty: "normal" },
  { word: "READING", category: "Actions", difficulty: "easy" },
  { word: "FISHING", category: "Actions", difficulty: "easy" },
  { word: "SINGING", category: "Actions", difficulty: "normal" },

  // ==================== TECHNOLOGY ====================
  { word: "ROBOT", category: "Technology", difficulty: "easy" },
  { word: "COMPUTER", category: "Technology", difficulty: "easy" },
  { word: "KEYBOARD", category: "Technology", difficulty: "normal" },
  { word: "MOUSE", category: "Technology", difficulty: "easy" },
  { word: "CONTROLLER", category: "Technology", difficulty: "normal" },
  { word: "DRONE", category: "Technology", difficulty: "normal" },
  { word: "HEADPHONES", category: "Technology", difficulty: "normal" },
  { word: "TELEVISION", category: "Technology", difficulty: "easy" },
  { word: "BATTERY", category: "Technology", difficulty: "easy" },
  { word: "SMARTPHONE", category: "Technology", difficulty: "normal" },
  { word: "SATELLITE", category: "Technology", difficulty: "hard" },

  // ==================== FUN / RANDOM ====================
  { word: "GHOST", category: "Fun / Random", difficulty: "easy" },
  { word: "DRAGON", category: "Fun / Random", difficulty: "normal" },
  { word: "ALIEN", category: "Fun / Random", difficulty: "easy" },
  { word: "SUPERHERO", category: "Fun / Random", difficulty: "normal" },
  { word: "PIRATE", category: "Fun / Random", difficulty: "normal" },
  { word: "WIZARD", category: "Fun / Random", difficulty: "normal" },
  { word: "MONSTER", category: "Fun / Random", difficulty: "easy" },
  { word: "NINJA", category: "Fun / Random", difficulty: "normal" },
  { word: "TREASURE", category: "Fun / Random", difficulty: "normal" },
  { word: "CROWN", category: "Fun / Random", difficulty: "easy" },
  { word: "UNICORN", category: "Fun / Random", difficulty: "normal" },
  { word: "COWBOY", category: "Fun / Random", difficulty: "normal" },
  { word: "ASTRONAUT", category: "Fun / Random", difficulty: "normal" },
  { word: "DETECTIVE", category: "Fun / Random", difficulty: "normal" },
  { word: "CHEF", category: "Fun / Random", difficulty: "easy" },
  { word: "MAGICIAN", category: "Fun / Random", difficulty: "normal" },
  { word: "ZOMBIE", category: "Fun / Random", difficulty: "normal" },
  { word: "VAMPIRE", category: "Fun / Random", difficulty: "normal" },
  { word: "MERMAID", category: "Fun / Random", difficulty: "normal" },
  { word: "TROPHY", category: "Fun / Random", difficulty: "easy" }
];

export function getRandomWord(
  difficulty: 'easy' | 'normal' | 'hard' | 'mixed' = 'normal',
  excludeWords: string[] = []
): WordEntry {
  const excludeSet = new Set(excludeWords.map(w => w.toUpperCase()));
  
  // Filter by difficulty first if not mixed
  let targetPool = WORDS_DATABASE;
  if (difficulty !== 'mixed') {
    const diffFiltered = WORDS_DATABASE.filter(w => w.difficulty === difficulty);
    if (diffFiltered.length > 0) {
      targetPool = diffFiltered;
    }
  }

  // Filter out recently used words in current game
  let available = targetPool.filter(w => !excludeSet.has(w.word.toUpperCase()));

  // If all suitable words in this difficulty have been exhausted, reset pool to prevent lockup
  if (available.length === 0) {
    available = targetPool;
  }

  const index = Math.floor(Math.random() * available.length);
  return available[index];
}
