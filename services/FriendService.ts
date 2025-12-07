import type { Friend, CreateFriendData } from '@/types/friend';

const STORAGE_KEY = 'task_manager_friends';

const loadFriends = (): Friend[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with some dummy data
      const defaultFriends: Friend[] = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ];
      saveFriends(defaultFriends);
      return defaultFriends;
    }
    
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveFriends = (friends: Friend[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export class FriendService {
  private static instance: FriendService;
  private friends: Friend[] = [];

  private constructor() {
    this.friends = loadFriends();
  }

  static getInstance(): FriendService {
    if (!FriendService.instance) {
      FriendService.instance = new FriendService();
    }
    return FriendService.instance;
  }

  getAllFriends(): Friend[] {
    return [...this.friends];
  }

  getFriendById(id: string): Friend | null {
    return this.friends.find(friend => friend.id === id) || null;
  }

  createFriend(data: CreateFriendData): Friend {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Friend name is required');
    }

    const friend: Friend = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
    };

    this.friends.push(friend);
    saveFriends(this.friends);
    return friend;
  }

  deleteFriend(id: string): void {
    const index = this.friends.findIndex(friend => friend.id === id);
    if (index === -1) {
      throw new Error(`Friend with id ${id} not found`);
    }

    this.friends.splice(index, 1);
    saveFriends(this.friends);
  }
}

export const friendService = FriendService.getInstance();
