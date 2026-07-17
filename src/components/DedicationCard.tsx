import { useState, useEffect } from 'react';
import { DedicationStar } from '../types';

interface DedicationCardProps {
  star: DedicationStar | null;
  onClose: () => void;
}

export function DedicationCard({ star, onClose }: DedicationCardProps) {
  const [calculation, setCalculation] = useState<{
    pull: string;
    velocity: string;
    verdict: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset calculations when the active star changes
  useEffect(() => {
    setCalculation(null);
  }, [star]);

  if (!star) {
    return (
      <div className="artistic-card p-4 md:p-8 rounded-[24px] h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-jupiter-ochre text-2xl md:text-3xl mb-3 md:mb-4 animate-pulse">
          🪐
        </div>
        <h4 className="text-base md:text-lg font-space text-white">El Núcleo de Júpiter</h4>
        <p className="text-[10px] md:text-xs font-sans text-purple-300/70 max-w-xs mt-1.5 md:mt-2 leading-relaxed">
          Toda la materia estelar gira a su alrededor. Selecciona una estrella orbitante para descifrar sus dedicatorias especiales y sentir la fuerza de su gravedad.
        </p>
      </div>
    );
  }

  // Romantic physics generator!
  const handleCalculatePull = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Calculate funny romantic mock telemetry
      const gForce = (10000 / star.distance).toFixed(1);
      const escVelStr = ((500 * 300) / star.distance).toFixed(0);
      
      let verdict = '';
      if (star.distance < 180) {
        verdict = 'La gravedad en este punto es incalculable. Tus coordenadas se han fusionado permanentemente con su corazón. No existe velocidad en el universo suficiente para escapar.';
      } else if (star.distance < 280) {
        verdict = 'Atracción perfecta. Te encuentras en una órbita geoestacionaria de amor. Estás destinado a ver su amanecer todos los días de tu año cósmico.';
      } else if (star.distance < 380) {
        verdict = 'Órbita estable. Tu admiración fluye de forma constante y armónica. Estás atrapado en una red electromagnética de miradas inolvidables.';
      } else {
        verdict = 'Vigilante lejano. Aunque orbits a gran distancia física, la inmensa gravedad de su existencia sigue marcando el rumbo de todos tus pensamientos celestes.';
      }

      setCalculation({
        pull: `${gForce} Gs (Atracción Total)`,
        velocity: `${escVelStr} km/s (Inalcanzable)`,
        verdict
      });
      setIsCalculating(false);
    }, 1200);
  };

  return (
    <div 
      className="artistic-card p-4 md:p-8 rounded-[24px] shadow-2xl relative overflow-hidden animate-fade-in flex flex-col justify-between h-full"
      style={{ boxShadow: `0 0 40px -10px ${star.color}33` }}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 md:w-3 h-2 md:h-3 border-t-2 border-l-2 border-white/10"></div>
      <div className="absolute top-0 right-0 w-2 md:w-3 h-2 md:h-3 border-t-2 border-r-2 border-white/10"></div>
      <div className="absolute bottom-0 left-0 w-2 md:w-3 h-2 md:h-3 border-b-2 border-l-2 border-white/10"></div>
      <div className="absolute bottom-0 right-0 w-2 md:w-3 h-2 md:h-3 border-b-2 border-r-2 border-white/10"></div>

      {/* Star specific glowing background blob */}
      <div 
        className="absolute -right-24 -top-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: star.color }}
      />

      <div>
        {/* Header Metadata */}
        <div className="flex justify-between items-start gap-3 md:gap-4 mb-3 md:mb-4 border-b border-white/10 pb-2 md:pb-3">
          <div>
            <span 
              className="inline-block px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-white border mb-1.5 md:mb-2 font-medium"
              style={{ backgroundColor: `${star.color}15`, borderColor: `${star.color}40`, color: star.color }}
            >
              {star.type === 'gravity' && '🪐 ATRACCIÓN ESPACIAL'}
              {star.type === 'birthday' && '🎂 FELICITACIÓN CELESTE'}
              {star.type === 'poem' && '✍️ POEMA GALÁCTICO'}
              {star.type === 'wish' && '💫 DESEO DE CUMPLEAÑOS'}
              {star.type === 'memory' && '🌌 MEMORIA SIDERAL'}
            </span>
            <h4 className="text-lg md:text-xl font-space font-bold text-white tracking-wide">{star.title}</h4>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-white bg-white/5 hover:bg-white/10 w-6 md:w-7 h-6 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-xs transition-colors border border-white/10 cursor-pointer"
            title="Cerrar dedicatoria"
          >
            ✕
          </button>
        </div>

        {/* The Romantic Dedication Text - Artistic Georgia Quote Style */}
        <div className="relative my-4 md:my-6 bg-white/5 p-4 md:p-8 rounded-xl border border-white/10">
          {/* Large Quote Icon */}
          <span className="absolute -top-2 md:-top-3 left-2 md:left-4 text-4xl md:text-6xl font-serif text-jupiter-ochre opacity-20 select-none">“</span>
          <p className="text-[#e0d8d0] text-sm md:text-lg leading-relaxed italic relative z-10 font-serif tracking-wide">
            {star.message}
          </p>
        </div>

        {/* Sender details */}
        <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-purple-300/60 mt-1 md:mt-2 mb-4 md:mb-6">
          <div>
            <span>Firmado por: </span>
            <strong className="text-white text-xs md:text-sm font-space font-medium">{star.sender}</strong>
          </div>
          <span className="bg-white/5 px-2 md:px-2.5 py-0.5 rounded border border-white/10">{star.date}</span>
        </div>
      </div>

      {/* Astro romantic physics analysis dashboard */}
      <div className="mt-auto pt-3 md:pt-4 border-t border-white/10">
        {!calculation ? (
          <button
            onClick={handleCalculatePull}
            disabled={isCalculating}
            className="w-full py-2 md:py-2.5 bg-white/5 hover:bg-white/10 text-jupiter-light hover:text-jupiter-ochre border border-white/10 rounded-xl text-[10px] md:text-xs font-mono tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-[#e3bb76] border-t-transparent rounded-full"></span>
                <span>PROCESANDO COORDENADAS GRAVITATORIAS...</span>
              </>
            ) : (
              <>
                <span>⚖️ CALCULAR FUERZA DE ATRACCIÓN</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2 md:space-y-3 bg-black/40 p-3 md:p-4 rounded-xl border border-white/10 animate-fade-in text-[10px] md:text-xs font-mono">
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 border-b border-white/5 pb-1.5 md:pb-2">
              <div>
                <span className="text-purple-400/60 block text-[7px] md:text-[9px]">TIRE GRAVITATORIO:</span>
                <span className="text-jupiter-light font-bold text-[10px] md:text-xs">{calculation.pull}</span>
              </div>
              <div>
                <span className="text-purple-400/60 block text-[7px] md:text-[9px]">VELOCIDAD DE ESCAPE:</span>
                <span className="text-red-400 font-bold text-[10px] md:text-xs">{calculation.velocity}</span>
              </div>
            </div>
            <div>
              <span className="text-jupiter-ochre font-semibold block text-[7px] md:text-[9px] mb-0.5 uppercase tracking-widest">DICTAMEN CÓSMICO:</span>
              <p className="text-purple-200 leading-relaxed text-[10px] md:text-[11px] font-sans">
                {calculation.verdict}
              </p>
            </div>
            <button
              onClick={() => setCalculation(null)}
              className="text-[8px] md:text-[9px] text-[#e3bb76] hover:text-[#c9905e] underline mt-0.5 md:mt-1 block"
            >
              Recalcular alineación estelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
