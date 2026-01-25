
import { FoodItem, CosmeticItem, Mission, ToyItem, PetStats } from './type';

export const INITIAL_STATS = {
  hunger: 80,
  energy: 70,
  fun: 60,
  hygiene: 90,
  health: 100,
  xp: 0,
  level: 1,
};

export const DECAY_RATES = {
  hunger: 0.1,
  energy: 0.05,
  fun: 0.15,
  hygiene: 0.08,
};

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'bamboo', name: 'Bamboo', emoji: '🎋', nutrition: 15, cost: 0 },
  { id: 'apple', name: 'Apple', emoji: '🍎', nutrition: 10, cost: 5 },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', nutrition: 25, cost: 20 },
  { id: 'sushi', name: 'Sushi', emoji: '🍣', nutrition: 20, cost: 15 },
  { id: 'cookie', name: 'Cookie', emoji: '🍪', nutrition: 5, cost: 2 },
];

export const TOY_ITEMS: ToyItem[] = [
  { id: 'ball', name: 'Ball', emoji: '⚽', funValue: 15, energyCost: 5, animation: 'bounce' },
  { id: 'duck', name: 'Ducky', emoji: '🐤', funValue: 10, energyCost: 2, animation: 'wiggle' },
  { id: 'car', name: 'Toy Car', emoji: '🏎️', funValue: 20, energyCost: 8, animation: 'spin' },
  { id: 'yarn', name: 'Yarn', emoji: '🧶', funValue: 12, energyCost: 4, animation: 'shake' },
];

export const COSMETIC_ITEMS: CosmeticItem[] = [
  { id: 'top_hat', name: 'Top Hat', emoji: '🎩', cost: 50, type: 'hat' },
  { id: 'party_hat', name: 'Party Hat', emoji: '🥳', cost: 30, type: 'hat' },
  { id: 'sunglasses', name: 'Cool Shades', emoji: '🕶️', cost: 40, type: 'eyes' },
  { id: 'bowtie', name: 'Bow Tie', emoji: '🎀', cost: 25, type: 'neck' },
  { id: 'crown', name: 'Crown', emoji: '👑', cost: 100, type: 'hat' },
];

export const MISSIONS: Mission[] = [
  { id: 'm1', title: 'Hungry Panda', description: 'Feed your panda 5 times', requirement: 5, reward: 50, type: 'feed' },
  { id: 'm2', title: 'Good Friend', description: 'Pet your panda 20 times', requirement: 20, reward: 30, type: 'pet' },
  { id: 'm3', title: 'Squeaky Clean', description: 'Wash your panda 3 times', requirement: 3, reward: 40, type: 'wash' },
  { id: 'm4', title: 'Game Master', description: 'Play with panda 5 times', requirement: 5, reward: 60, type: 'play' },
  { id: 'm5', title: 'Growing Up', description: 'Reach Level 2', requirement: 2, reward: 100, type: 'level' },
];

// Panda dialogue messages based on stats
const PANDA_DIALOGUE = {
  hungry: ['I\'m so hungry! 🤤', 'My belly is rumbling... 😭', 'Feed me please! 🎋', 'I\'m starving! 😫'],
  tired: ['So sleepy... 😴', 'I need a nap... zzz', 'Energy is low... 🥱', 'Can\'t keep my eyes open...'],
  happy: ['This is fun! 🎉', 'Wheee! I\'m so happy! 😄', 'Best day ever! 🌟', 'Yay! You\'re amazing! 💕'],
  sad: ['I\'m bored... 😔', 'Can we play? 🥺', 'I feel lonely...', 'Cheer me up! 😞'],
  dirty: ['I need a bath! 🧼', 'I\'m so dirty... 🤢', 'Can I have a wash? 🛁', 'Eww, I\'m muddy! 🙈'],
  sick: ['I don\'t feel well... 🤒', 'I\'m not feeling great...', 'Help me feel better! 💊', 'My tummy hurts... 😖'],
  default: ['Hello! 👋', 'What\'s up? 🐼', 'How are you? 😊', 'I\'m here! 🎀', 'Hiya! 👋', 'Nice to see you! 💚'],
};

export const getPandaDialogue = async (stats: PetStats, customMessage?: string): Promise<string> => {
  if (customMessage) {
    return `🐼 ${customMessage}`;
  }

  let messagePool: string[] = [];

  // Determine mood based on stats
  if (stats.hunger < 30) {
    messagePool = PANDA_DIALOGUE.hungry;
  } else if (stats.energy < 20) {
    messagePool = PANDA_DIALOGUE.tired;
  } else if (stats.fun > 80) {
    messagePool = PANDA_DIALOGUE.happy;
  } else if (stats.fun < 20) {
    messagePool = PANDA_DIALOGUE.sad;
  } else if (stats.hygiene < 30) {
    messagePool = PANDA_DIALOGUE.dirty;
  } else if (stats.health < 50) {
    messagePool = PANDA_DIALOGUE.sick;
  } else {
    messagePool = PANDA_DIALOGUE.default;
  }

  // Return random message from pool
  const randomIndex = Math.floor(Math.random() * messagePool.length);
  return messagePool[randomIndex];
};
