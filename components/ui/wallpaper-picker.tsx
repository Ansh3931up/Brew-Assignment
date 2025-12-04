'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from '@/providers/theme-provider'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { logger } from '@/lib/utils/logger'

export function WallpaperPicker() {
  const { wallpaper, setWallpaper } = useTheme()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)
    
    try {
      // Convert to base64 or data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setWallpaper(result)
        setIsUploading(false)
      }
      reader.onerror = () => {
        alert('Failed to read image file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      logger.error('Error uploading wallpaper:', error)
      alert('Failed to upload wallpaper')
      setIsUploading(false)
    }
  }

  const handleRemoveWallpaper = () => {
    setWallpaper(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlInput = (url: string) => {
    if (url.trim()) {
      setWallpaper(url.trim())
    } else {
      setWallpaper(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-foreground dark:text-text-primaryDark uppercase tracking-wider">
        Wallpaper
      </div>
      
      {/* Current Wallpaper Preview */}
      {wallpaper && (
        <div className="relative group">
          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border dark:border-border-darkMode">
            <Image
              src={wallpaper}
              alt="Current wallpaper"
              fill
              className="object-cover"
              unoptimized
              onError={() => {
                alert('Failed to load wallpaper image')
                setWallpaper(null)
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleRemoveWallpaper}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                aria-label="Remove wallpaper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="wallpaper-upload"
        />
        <label
          htmlFor="wallpaper-upload"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground dark:text-text-primaryDark bg-background dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg hover:bg-accent dark:hover:bg-background-mutedDark transition-colors cursor-pointer"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Wallpaper</span>
            </>
          )}
        </label>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-xs text-muted-foreground dark:text-text-mutedDark mb-1">
          Or enter image URL
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-text-mutedDark" />
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={wallpaper && !wallpaper.startsWith('data:') ? wallpaper : ''}
            onChange={(e) => handleUrlInput(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-background dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-text-primaryDark placeholder:text-muted-foreground dark:placeholder:text-text-mutedDark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

