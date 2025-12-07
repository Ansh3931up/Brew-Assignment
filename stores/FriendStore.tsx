'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Friend, CreateFriendData } from '@/types/friend';
import { friendService } from '@/services/FriendService';

interface FriendStoreContextType {
  friends: Friend[];
  loading: boolean;
  error: string | null;
  // Actions
  loadFriends: () => void;
  createFriend: (data: CreateFriendData) => Promise<Friend>;
  deleteFriend: (id: string) => Promise<void>;
  getFriendById: (id: string) => Friend | null;
}

const FriendStoreContext = createContext<FriendStoreContextType | undefined>(undefined);

export function FriendStoreProvider({ children }: { children: React.ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const allFriends = friendService.getAllFriends();
      setFriends(allFriends);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFriend = useCallback(async (data: CreateFriendData): Promise<Friend> => {
    setError(null);
    try {
      const newFriend = friendService.createFriend(data);
      setFriends(prev => [...prev, newFriend]);
      return newFriend;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create friend';
      setError(message);
      throw err;
    }
  }, []);

  const deleteFriend = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      friendService.deleteFriend(id);
      setFriends(prev => prev.filter(friend => friend.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete friend';
      setError(message);
      throw err;
    }
  }, []);

  const getFriendById = useCallback((id: string): Friend | null => {
    return friends.find(friend => friend.id === id) || null;
  }, [friends]);

  // Load friends on mount
  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const value: FriendStoreContextType = {
    friends,
    loading,
    error,
    loadFriends,
    createFriend,
    deleteFriend,
    getFriendById,
  };

  return (
    <FriendStoreContext.Provider value={value}>
      {children}
    </FriendStoreContext.Provider>
  );
}

export function useFriendStore() {
  const context = useContext(FriendStoreContext);
  if (context === undefined) {
    throw new Error('useFriendStore must be used within a FriendStoreProvider');
  }
  return context;
}
