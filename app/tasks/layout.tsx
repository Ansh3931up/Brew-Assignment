'use client';

import React from 'react';
import { AppStoreProvider } from '@/stores';

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppStoreProvider>{children}</AppStoreProvider>;
}
