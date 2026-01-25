
export interface PetStats {
  hunger: number;
  energy: number;
  fun: number;
  hygiene: number;
  health: number;
  xp: number;
  level: number;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  nutrition: number;
  cost: number;
}

export interface ToyItem {
  id: string;
  name: string;
  emoji: string;
  funValue: number;
  energyCost: number;
  animation?: 'bounce' | 'spin' | 'wiggle' | 'shake';
}

export interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: 'hat' | 'eyes' | 'neck';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: number;
  type: 'feed' | 'pet' | 'wash' | 'play' | 'level';
}

export interface MissionStatus {
  missionId: string;
  progress: number;
  claimed: boolean;
}

export interface GameMessage {
  text: string;
  sender: 'panda' | 'system';
}
