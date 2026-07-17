import React, { useEffect, useRef, useState } from 'react';
import { DedicationStar } from '../types';

interface SpaceCanvasProps {
  stars: DedicationStar[];
  selectedStarId: string | null;
  gravityMultiplier: number;
  onStarSelect: (star: DedicationStar | null) => void;
  onStarHover: (star: DedicationStar) => void;
}

export function SpaceCanvas({
  stars,
  selectedStarId,
  gravityMultiplier,
  onStarSelect,
  onStarHover,
}: SpaceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  
  // Animation states
  const starsStateRef = useRef<DedicationStar[]>([]);
  const jupiterRotationRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const distanceScaleRef = useRef(1);

  // Update internal stars state when prop changes, retaining angles
  useEffect(() => {
    // If we already have tracked angles, preserve them
    const existingMap = new Map(starsStateRef.current.map(s => [s.id, s.angle]));
    
    starsStateRef.current = stars.map(star => ({
      ...star,
      angle: existingMap.has(star.id) ? (existingMap.get(star.id) || star.angle) : star.angle
    }));
  }, [stars]);

  // Handle ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Ensure standard dimensions
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 500),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Set up canvas and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize decorative background stars (stardust) once or dynamically
    const bgStarsCount = Math.floor((dimensions.width * dimensions.height) / 3000);
    const bgStars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < bgStarsCount; i++) {
      bgStars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    // Scale star distances to fit canvas size
    const maxRawDistance = Math.max(...stars.map(s => s.distance), 1);
    const maxFitRadius = Math.min(cx, cy) * 0.82;
    const distanceScale = maxFitRadius / maxRawDistance;
    distanceScaleRef.current = distanceScale;

    const render = () => {
      // Clear with soft space tail to allow beautiful movement trails
      ctx.fillStyle = 'rgba(5, 5, 16, 0.25)'; // #050510 background tail matching the Artistic Flair theme
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw background ambient starfield (stardust)
      bgStars.forEach(bs => {
        bs.alpha += (Math.random() - 0.5) * 0.04;
        if (bs.alpha < 0.1) bs.alpha = 0.1;
        if (bs.alpha > 0.8) bs.alpha = 0.8;

        ctx.fillStyle = `rgba(255, 255, 255, ${bs.alpha})`;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, bs.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update Jupiter Rotation
      jupiterRotationRef.current += 0.002;

      // Draw Orbit Rings
      starsStateRef.current.forEach(star => {
        ctx.strokeStyle = selectedStarId === star.id 
          ? 'rgba(255, 107, 107, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = selectedStarId === star.id ? 1.5 : 1;
        ctx.beginPath();
        ctx.setLineDash([4, 12]);
        ctx.arc(cx, cy, star.distance * distanceScale, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]); // reset

      // Mouse position vector checking
      let currentHoveredId: string | null = null;
      let closestDist = 20; // Hover trigger distance (pixels)

      // Render orbiting dedication stars
      starsStateRef.current.forEach((star) => {
        // Orbit mathematics: Angle = angle + constant_speed * gravityMultiplier
        const baseSpeed = star.speed;
        // Gravity increases orbital speed (Kepler's third law style - closer is faster, scaled by gravityMultiplier)
        const gravitySpeedMod = baseSpeed * gravityMultiplier;
        star.angle += gravitySpeedMod;
        if (star.angle > Math.PI * 2) {
          star.angle -= Math.PI * 2;
        }

        const scaledDistance = star.distance * distanceScale;
        const sx = cx + Math.cos(star.angle) * scaledDistance;
        const sy = cy + Math.sin(star.angle) * scaledDistance;

        // Mouse hover test
        const dx = mousePosRef.current.x - sx;
        const dy = mousePosRef.current.y - sy;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < closestDist) {
          closestDist = distanceToMouse;
          currentHoveredId = star.id;
        }

        const isSelected = selectedStarId === star.id;
        const isHovered = hoveredStarId === star.id;

        // Draw gravity pull vector line for active stars
        if (isHovered || isSelected) {
          ctx.strokeStyle = isSelected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.setLineDash([2, 4]);
          ctx.moveTo(cx, cy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
          ctx.setLineDash([]); // reset

          // Draw orbital telemetry labels
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = isSelected ? '#ff8787' : 'rgba(255, 255, 255, 0.6)';
          const speedLabel = `v = ${(gravitySpeedMod * 1000).toFixed(1)} km/s`;
          const distLabel = `r = ${(star.distance * 10).toFixed(0)} AU`;
          ctx.fillText(`${speedLabel} | ${distLabel}`, sx + 15, sy - 5);
        }

        // Star pulsing effect - scale size on small screens for easier tapping
        const sizeScale = Math.min(1, Math.min(dimensions.width, dimensions.height) / 500) * 1.5 + 0.5;
        const pulse = 1 + Math.sin(Date.now() * 0.005 + star.distance) * 0.15;
        const renderSize = star.size * sizeScale * pulse * (isHovered ? 1.4 : 1.0) * (isSelected ? 1.6 : 1.0);

        // Draw Star Glow
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, renderSize * 3);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.3, star.glowColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sx, sy, renderSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw Core Star
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sx, sy, renderSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Target HUD for selected star
        if (isSelected) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, renderSize * 1.5, 0, Math.PI * 2);
          ctx.stroke();

          // Crosshairs
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
          ctx.beginPath();
          ctx.moveTo(sx - renderSize * 2.2, sy);
          ctx.lineTo(sx - renderSize * 1.2, sy);
          ctx.moveTo(sx + renderSize * 1.2, sy);
          ctx.lineTo(sx + renderSize * 2.2, sy);
          ctx.moveTo(sx, sy - renderSize * 2.2);
          ctx.lineTo(sx, sy - renderSize * 1.2);
          ctx.moveTo(sx, sy + renderSize * 1.2);
          ctx.lineTo(sx, sy + renderSize * 2.2);
          ctx.stroke();
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx, sy, renderSize * 1.4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Update hovered star trigger and audio chime
      if (currentHoveredId !== hoveredStarId) {
        setHoveredStarId(currentHoveredId);
        if (currentHoveredId) {
          const hoveredStar = starsStateRef.current.find(s => s.id === currentHoveredId);
          if (hoveredStar) {
            onStarHover(hoveredStar);
          }
        }
      }

      // -----------------------------------------------------------------
      // DRAW JUPITER (THE CENTRAL MASSIVE BODY)
      // -----------------------------------------------------------------
      const jupiterRadius = Math.max(35, Math.min(65, Math.min(dimensions.width, dimensions.height) * 0.12));
      
      // Outer gravity distortion waves
      const pulseWave = (Math.sin(Date.now() * 0.001) + 1) / 2;
      ctx.strokeStyle = `rgba(224, 130, 68, ${0.05 + pulseWave * 0.04})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, jupiterRadius + 15 + pulseWave * 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(168, 85, 247, ${0.03 + (1 - pulseWave) * 0.03})`;
      ctx.beginPath();
      ctx.arc(cx, cy, jupiterRadius + 40 + (1 - pulseWave) * 30, 0, Math.PI * 2);
      ctx.stroke();

      // Save canvas context for sphere clipping
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, jupiterRadius, 0, Math.PI * 2);
      ctx.clip();

      // Fill basic background color of Jupiter (Warm terracotta beige)
      ctx.fillStyle = '#d29b71';
      ctx.fillRect(cx - jupiterRadius, cy - jupiterRadius, jupiterRadius * 2, jupiterRadius * 2);

      // Draw gas bands (moving slowly via jupiterRotationRef)
      const bandOffset = jupiterRotationRef.current * 8;
      const bands = [
        { y: -0.8, h: 0.15, color: '#68362b' }, // Dark North Polar
        { y: -0.65, h: 0.1, color: '#e5b18a' }, // Light North Zone
        { y: -0.55, h: 0.18, color: '#974f3b' }, // North Tropical Belt
        { y: -0.37, h: 0.08, color: '#f7dfc6' }, // White band
        { y: -0.29, h: 0.14, color: '#884334' }, // North Equatorial Belt
        { y: -0.15, h: 0.12, color: '#dfa679' }, // Equatorial Zone
        { y: -0.03, h: 0.15, color: '#79392c' }, // South Equatorial Belt
        { y: 0.12, h: 0.08, color: '#fad4b2' }, // White band
        { y: 0.2, h: 0.2, color: '#944b3c' }, // South Tropical Belt
        { y: 0.4, h: 0.12, color: '#dca47b' }, // Light South Zone
        { y: 0.52, h: 0.18, color: '#73372c' }, // South South Belt
        { y: 0.7, h: 0.2, color: '#562b24' }, // South Polar region
      ];

      bands.forEach(band => {
        const topY = cy + band.y * jupiterRadius;
        const height = band.h * jupiterRadius;
        
        ctx.fillStyle = band.color;
        ctx.fillRect(cx - jupiterRadius, topY, jupiterRadius * 2, height);

        // Draw gas turbulence details (little waves/stripes) inside the band
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        for (let x = cx - jupiterRadius; x <= cx + jupiterRadius; x += 10) {
          const waveY = topY + Math.sin((x + bandOffset * 10) * 0.05) * (height * 0.15);
          ctx.fillRect(x, waveY, 5, height * 0.4);
        }
      });

      // Draw the Great Red Spot (CRIMSON STORM!)
      // Rotates slowly in the South Tropical Belt (y ≈ 0.25, offset to right)
      const grsX = cx + Math.cos(jupiterRotationRef.current * 0.5) * (jupiterRadius * 0.4) - (jupiterRadius * 0.1);
      const grsY = cy + jupiterRadius * 0.28;
      const grsW = jupiterRadius * 0.32;
      const grsH = jupiterRadius * 0.2;

      // Outer Red Spot glow/fringe
      ctx.fillStyle = '#b73721';
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, grsW, grsH, 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Inner Red Spot core
      ctx.fillStyle = '#651c10';
      ctx.beginPath();
      ctx.ellipse(grsX, grsY - 1, grsW * 0.6, grsH * 0.6, 0.08, 0, Math.PI * 2);
      ctx.fill();

      // White storm trail swirling around it
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(grsX - grsW * 1.1, grsY + grsH * 0.3, grsW * 0.5, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();

      // Restore clipping context to draw 3D atmospheric lighting over the globe
      ctx.restore();

      // Spherical shading overlay (creates beautiful 3D spherical depth)
      // Light coming from top-left, deep shadow on bottom-right
      const sphereShade = ctx.createRadialGradient(
        cx - jupiterRadius * 0.3, 
        cy - jupiterRadius * 0.3, 
        jupiterRadius * 0.2, 
        cx, 
        cy, 
        jupiterRadius
      );
      sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.45)'); // intense highlight
      sphereShade.addColorStop(0.4, 'rgba(0, 0, 0, 0)'); // midtone
      sphereShade.addColorStop(0.85, 'rgba(0, 0, 0, 0.75)'); // deep terminator shadow
      sphereShade.addColorStop(1, 'rgba(0, 0, 0, 0.95)'); // edge dark vacuum

      ctx.fillStyle = sphereShade;
      ctx.beginPath();
      ctx.arc(cx, cy, jupiterRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric limb glow (thin blue/orange halo)
      ctx.strokeStyle = 'rgba(244, 180, 133, 0.3)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, jupiterRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Centered HUD Coordinate markings around Jupiter
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(224, 130, 68, 0.5)';
      ctx.fillText('JUPITER MASSIVE CORE', cx - 45, cy - jupiterRadius - 10);
      ctx.fillText(`M = 1.898e27 kg`, cx - 40, cy + jupiterRadius + 15);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dimensions, selectedStarId, gravityMultiplier, hoveredStarId, onStarHover]);

  // Handle Mouse Move over Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate mouse coordinate relative to canvas size
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Handle Mouse Leave
  const handleMouseLeave = () => {
    mousePosRef.current = { x: -9999, y: -9999 };
    setHoveredStarId(null);
  };

  // Handle Mouse Click
  const handleCanvasClick = () => {
    if (hoveredStarId) {
      const selected = starsStateRef.current.find(s => s.id === hoveredStarId);
      if (selected) {
        onStarSelect(selected);
      }
    } else {
      // Clicked on empty empty space
      onStarSelect(null);
    }
  };

  // Handle Touch for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    // Find closest star
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    let closestStar: DedicationStar | null = null;
    let closestDist = 50; // Touch is less precise, bigger radius
    const scale = distanceScaleRef.current;

    starsStateRef.current.forEach((star) => {
      const sx = cx + Math.cos(star.angle) * star.distance * scale;
      const sy = cy + Math.sin(star.angle) * star.distance * scale;
      const dx = touchX - sx;
      const dy = touchY - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closestStar = star;
      }
    });

    if (closestStar) {
      onStarHover(closestStar);
      onStarSelect(closestStar);
    } else {
      onStarSelect(null);
    }
  };

  return (
    <div 
      id="space-canvas-container"
      ref={containerRef} 
      className="relative w-full h-[400px] md:h-[650px] bg-[#050510] rounded-[24px] overflow-hidden border border-white/10 select-none cursor-crosshair shadow-2xl shadow-black/50"
    >
      {/* Background Deep Space Purple Blur Dust */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-900/10 rounded-full nebula-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full nebula-glow"></div>

      {/* Actual interactive rendering canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        className="w-full h-full block"
      />

      {/* Orbit System Instructions Overlay */}
      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 pointer-events-none flex flex-col sm:flex-row sm:items-center sm:justify-between text-[9px] md:text-[11px] font-mono text-purple-300/60 bg-black/40 backdrop-blur-md px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-purple-900/30 gap-1">
        <div className="flex items-center gap-1 md:gap-1.5">
          <span className="inline-block w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>ESTADO: ÓRBITAS SENSORIZADAS</span>
        </div>
        <span className="text-right">★ TOCA UNA ESTRELLA PARA LEER SU DEDICATORIA</span>
      </div>
    </div>
  );
}
