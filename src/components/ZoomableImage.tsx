'use client';

import { useState, useRef, MouseEvent } from 'react';
import { ZoomIn, ZoomOut, X } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (isZoomed) {
      setPosition({ x: 50, y: 50 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 1.5), 4);
    setZoomLevel(newZoom);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`relative cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 cursor-zoom-in"
          style={isZoomed ? {
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${position.x}% ${position.y}%`,
          } : undefined}
        />

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
          <span>Click to zoom</span>
        </div>
      </div>

      {/* Zoom controls */}
      {isZoomed && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((prev) => Math.min(prev + 0.5, 4));
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((prev) => Math.max(prev - 0.5, 1.5));
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
              setZoomLevel(2);
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Expanded view modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={toggleZoom}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: `${position.x}% ${position.y}%`,
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={toggleZoom}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            Scroll to zoom • Click outside to close
          </div>
        </div>
      )}
    </div>
  );
}
