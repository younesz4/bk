'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Check if hovering over interactive elements
      const target = e.target
      if (!target || !(target instanceof Element)) {
        setIsHovering(false)
        return
      }
      
      const htmlTarget = target as HTMLElement
      const isInteractive =
        htmlTarget.tagName === 'A' ||
        htmlTarget.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('.lux-btn') !== null ||
        target.closest('[role="button"]') !== null ||
        target.closest('[onclick]') !== null ||
        (htmlTarget.style && window.getComputedStyle(htmlTarget).cursor === 'pointer')
      
      setIsHovering(!!isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', updateCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updateCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      {/* Custom cursor dot */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`cursor-dot ${isHovering ? 'cursor-hover' : ''} ${isClicking ? 'cursor-click' : ''}`}
        />
        {isHovering && (
          <div className="cursor-ring" />
        )}
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }

        .custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: transform 0.15s ease-out;
        }

        .cursor-dot {
          width: 8px;
          height: 8px;
          background: #FCFBFC;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .cursor-ring {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-in-out infinite;
        }

        .cursor-hover .cursor-dot {
          width: 12px;
          height: 12px;
          background: #FCFBFC;
        }

        .cursor-click .cursor-dot {
          width: 6px;
          height: 6px;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        /* Hide cursor on mobile/touch devices */
        @media (hover: none) and (pointer: coarse) {
          .custom-cursor {
            display: none;
          }
          
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  )
}

