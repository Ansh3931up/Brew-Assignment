'use client'

import { useState, useEffect } from 'react'
import { soundService } from '@/lib/utils/sound'

export function SoundSettings() {
  // Use default values that match server-side rendering
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Initialize soundService
    soundService.init()
    // Read from localStorage after mount
    const storedEnabled = localStorage.getItem('sound_enabled')
    const storedVolume = localStorage.getItem('sound_volume')

    let finalEnabled = true
    let finalVolume = 50

    if (storedEnabled !== null) {
      finalEnabled = storedEnabled === 'true'
    }

    if (storedVolume !== null) {
      finalVolume = parseFloat(storedVolume) * 100
    }

    // Batch state updates using requestAnimationFrame to avoid cascading renders
    requestAnimationFrame(() => {
      setMounted(true)
      setEnabled(finalEnabled)
      setVolume(finalVolume)
      // Sync soundService with final values
      soundService.setEnabled(finalEnabled)
      soundService.setVolume(finalVolume / 100)
    })
  }, [])

  const toggleSound = () => {
    const newValue = !enabled
    setEnabled(newValue)
    soundService.setEnabled(newValue)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    soundService.setVolume(newVolume / 100)
  }

  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="font-heading text-foreground mb-4 text-lg font-semibold">
        Sound Settings
      </h3>
      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleSound}
            className="accent-primary h-4 w-4"
          />
          <span className="text-foreground">Enable Sounds</span>
        </label>
        <div>
          <label className="text-foreground mb-2 block text-sm font-medium">
            Volume: {mounted ? volume : 50}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={mounted ? volume : 50}
            onChange={handleVolumeChange}
            disabled={!enabled}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="text-muted-foreground text-xs">
          Sounds will play for notifications, errors, and success actions
        </div>
      </div>
    </div>
  )
}
