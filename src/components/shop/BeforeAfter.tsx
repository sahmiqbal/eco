
import { useState, useRef } from 'react'

interface BeforeAfterProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = 'Avant',
  afterLabel = 'Après'
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculatePosition = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const isRTL = window.getComputedStyle(containerRef.current).direction === 'rtl'
    
    // Calculate distance from the physical left
    const x = clientX - rect.left
    let percentage = (x / rect.width) * 100

    // In RTL, we want the percentage to represent the distance from the RIGHT
    if (isRTL) {
      percentage = 100 - percentage
    }

    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    calculatePosition(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    calculatePosition(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-secondary rounded-2xl overflow-hidden border border-border cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ aspectRatio: '4/3' }}
    >
      {/* Background Image (Before) */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Clipped Image (After) - Anchored to the "start" of the text direction */}
      <div
        className="absolute inset-y-0 start-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          // Critical: The inner image must be full width and anchored to the same "start" 
          // to prevent it from sliding with the container.
          className="absolute inset-y-0 start-0 w-[var(--container-width)] h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
      </div>

      {/* Slider Handle - Uses 'start' instead of 'left' */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ 
          // Modern CSS 'inset-inline-start' works for both RTL and LTR
          insetInlineStart: `${sliderPosition}%` 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-primary" />
              <div className="w-0.5 h-3 bg-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Labels - Using logical 'start' and 'end' */}
      <div className="absolute top-4 start-4 bg-black/50 text-white px-3 py-1 rounded-lg text-xs font-semibold">
        {beforeLabel}
      </div>
      <div className="absolute top-4 end-4 bg-black/50 text-white px-3 py-1 rounded-lg text-xs font-semibold">
        {afterLabel}
      </div>
    </div>
  )
}