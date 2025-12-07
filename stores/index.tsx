'use client';

import React from 'react';
import { TaskStoreProvider } from './TaskStore';
import { FriendStoreProvider } from './FriendStore';
import { ThemeStoreProvider } from './ThemeStore';

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeStoreProvider>
      <TaskStoreProvider>
        <FriendStoreProvider>
          {children}
        </FriendStoreProvider>
      </TaskStoreProvider>
    </ThemeStoreProvider>
  );
}
