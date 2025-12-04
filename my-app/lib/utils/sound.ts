'use client'

class SoundService {
  private enabled: boolean = true
  private volume: number = 0.5

  private playSound(url: string) {
    if (!this.enabled) return

    const audio = new Audio(url)
    audio.volume = this.volume
    audio.play().catch(() => {
      // Ignore errors (user interaction required or file not found)
    })
  }

  success() {
    // Using Web Audio API for simple beep sounds
    this.playBeep(800, 200)
  }

  error() {
    this.playBeep(400, 300)
  }

  notification() {
    this.playBeep(600, 150)
  }

  private playBeep(frequency: number, duration: number) {
    if (!this.enabled) return

    // Handle webkitAudioContext for Safari compatibility
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextClass) return

    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      this.volume * 0.3,
      audioContext.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    )

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_enabled', String(enabled))
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_volume', String(volume))
    }
  }

  getEnabled() {
    return this.enabled
  }

  getVolume() {
    return this.volume
  }

  init() {
    if (typeof window === 'undefined') return

    const enabled = localStorage.getItem('sound_enabled')
    const volume = localStorage.getItem('sound_volume')

    if (enabled !== null) this.enabled = enabled === 'true'
    if (volume !== null) this.volume = parseFloat(volume)
  }
}

export const soundService = new SoundService()

// Initialize on load
if (typeof window !== 'undefined') {
  soundService.init()
}
