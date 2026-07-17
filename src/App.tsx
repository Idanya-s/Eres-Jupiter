import { useState } from 'react';
import { SpaceCanvas } from './components/SpaceCanvas';
import { DedicationCard } from './components/DedicationCard';
import { DEFAULT_DEDICATIONS } from './data/defaultDedications';
import { useCosmicAudio } from './hooks/useCosmicAudio';
import { DedicationStar } from './types';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Activity, 
  Clock, 
  Heart, 
  Compass, 
  Star 
} from 'lucide-react';

export default function App() {
  const [stars] = useState<DedicationStar[]>(DEFAULT_DEDICATIONS);
  const [selectedStar, setSelectedStar] = useState<DedicationStar | null>(null);
  const [gravityMultiplier, setGravityMultiplier] = useState<number>(1.2);
  const [targetName] = useState<string>('Fernanda');

  // Custom audio synthesizer hook
  const { 
    isPlaying: isPlayingMusic, 
    volume, 
    toggleMusic, 
    adjustVolume, 
    playStarTwinkle 
  } = useCosmicAudio();

  // Sound triggers
  const handleStarHover = (star: DedicationStar) => {
    // Dynamic pitch: closer stars get a higher-pitched sound
    const pitchMultiplier = 350 / star.distance;
    playStarTwinkle(pitchMultiplier);
  };

  const handleStarSelect = (star: DedicationStar | null) => {
    setSelectedStar(star);
    if (star) {
      playStarTwinkle(1.0);
    }
  };

  return (
    <div className="min-h-screen space-gradient text-slate-100 font-sans selection:bg-jupiter-ochre/35 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      
      {/* Tiny floating star background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f123510_1px,transparent_1px),linear-gradient(to_bottom,#1f123510_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* TOP DECORATIVE HEADER */}
      <header className="relative border-b border-white/10 bg-[#050510]/60 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
          
          {/* Brand/Theme Tagline */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-xl bg-gradient-to-br from-jupiter-dark to-jupiter-ochre flex items-center justify-center shadow-lg shadow-black/50">
              <span className="text-white font-space font-extrabold text-sm md:text-base">4🪐</span>
            </div>
            <div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[8px] md:text-[10px] font-mono text-jupiter-light uppercase tracking-widest font-semibold">SISTEMA GRAVITATORIO JÚPITER</span>
                <span className="w-1 h-1.5 md:w-1.5 md:h-1.5 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <h1 className="text-lg md:text-xl font-space font-extrabold text-white tracking-wider title-gradient">ATRACCIÓN CÓSMICA</h1>
            </div>
          </div>

          {/* Birthday Target Personalizer */}
          <div className="flex items-center gap-2 md:gap-3.5 bg-white/5 px-3 md:px-4 py-1.5 md:py-2.5 rounded-[24px] border border-white/10">
            <div className="text-right">
              <span className="text-[8px] md:text-[9px] font-mono text-purple-300/50 uppercase block tracking-wider leading-none">CUMPLEAÑOS DE HOY • 17 DE JULIO</span>
              <div className="text-jupiter-light text-xs md:text-sm font-space font-bold tracking-wide flex items-center gap-1.5 justify-end mt-0.5">
                <span>{targetName}</span>
              </div>
            </div>
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 animate-pulse">
              <Heart className="w-3.5 md:w-4 h-3.5 md:h-4 fill-pink-400" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BENTO LAYOUT */}
      <main className="max-w-7xl w-full mx-auto px-3 md:px-4 py-4 md:py-8 flex-grow space-y-4 md:space-y-6 relative z-10">
        
        {/* UPPER BANNER / LOVE GRAVITY ARGUMENT */}
        <section className="artistic-card p-4 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-jupiter-ochre/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl">
            <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-mono text-jupiter-ochre mb-1.5 md:mb-2">
              <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-jupiter-ochre" />
              <span>TEOREMA DE LA SINGULARIDAD GRAVITATORIA</span>
            </div>
            <h2 className="text-xl md:text-3xl font-space font-extrabold text-white tracking-wide mb-2 md:mb-3 title-gradient">
              ¿Por qué Júpiter?
            </h2>
            <p className="text-xs md:text-base text-[#e0d8d0] leading-relaxed font-serif italic">
              "Júpiter es el planeta más colosal de nuestro sistema solar. Su gravedad es tan inmensa e irresistible que nada de lo que entra en su campo de influencia puede escapar de su atracción; todo es atraído sin remedio hacia su centro. <strong className="text-jupiter-light font-sans not-italic font-bold">Así me siento yo por ti, {targetName}.</strong> Eres mi centro de gravedad cósmico; todo lo que soy orbita a tu alrededor, felizmente atrapado en tu increíble gravedad el 17 de Julio."
            </p>
          </div>
        </section>

        {/* PRIMARY INTERACTIVE DASHBOARD SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* THE SPACE CANVAS - JUPITER MAP (Takes 2 Cols on Desktop) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1 md:px-2 text-[9px] md:text-xs font-mono text-purple-300/60">
              <span className="flex items-center gap-1 md:gap-1.5">
                <Compass className="w-3 md:w-3.5 h-3 md:h-3.5 text-purple-400" />
                <span>MAPA ORBITAL EN TIEMPO REAL</span>
              </span>
              <span className="hidden sm:inline">COORD: RA 17h 17m / DEC -22° 42'</span>
            </div>
            
            <SpaceCanvas 
              stars={stars} 
              selectedStarId={selectedStar?.id || null}
              gravityMultiplier={gravityMultiplier}
              onStarSelect={handleStarSelect}
              onStarHover={handleStarHover}
            />
          </div>

          {/* TELEMETRY DECK & SELECTED STAR READOUT (Takes 1 Col) */}
          <div className="flex flex-col space-y-6 h-full">
            
            {/* CURRENT TELEMETRY BOARD */}
            <div className="artistic-card p-4 md:p-6 rounded-[24px] space-y-3 md:space-y-4">
              <h4 className="text-[10px] md:text-xs font-mono text-purple-400 uppercase tracking-widest border-b border-white/10 pb-1.5 md:pb-2 flex items-center gap-1.5 md:gap-2">
                <Activity className="w-3.5 md:w-4 h-3.5 md:h-4 text-jupiter-ochre" />
                <span>Cuadro de Mandos Cósmico</span>
              </h4>

              {/* Gravity Adjuster slider */}
              <div className="space-y-1 md:space-y-1.5">
                <div className="flex justify-between text-[10px] md:text-[11px] font-mono">
                  <span className="text-purple-300/70">CONSTANTE GRAVITACIONAL</span>
                  <span className="text-jupiter-light font-semibold">G = {gravityMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.2"
                  value={gravityMultiplier}
                  onChange={(e) => setGravityMultiplier(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jupiter-ochre"
                />
                <p className="text-[9px] md:text-[10px] text-purple-400/50 font-mono text-right leading-none mt-0.5 md:mt-1">
                  Arrastra para acelerar/desacelerar la órbita estelar
                </p>
              </div>

              {/* Synth Music Ambient Section */}
              <div className="bg-white/5 p-3 md:p-3.5 rounded-xl border border-white/10 space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-mono text-purple-300/70">MÚSICA MISTERIO CÓSMICO</span>
                  <span className={`text-[8px] md:text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${isPlayingMusic ? 'bg-jupiter-ochre/20 text-jupiter-light border border-jupiter-ochre/35' : 'bg-white/5 text-purple-400/50'}`}>
                    {isPlayingMusic ? 'Activa' : 'Pausada'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={toggleMusic}
                    className={`w-9 md:w-10 h-9 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isPlayingMusic 
                        ? 'bg-gradient-to-r from-jupiter-dark via-jupiter-ochre to-jupiter-light text-white shadow-lg shadow-black/45 scale-105' 
                        : 'bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10'
                    }`}
                    title={isPlayingMusic ? "Pausar música cósmica" : "Iniciar música de ambiente cósmica"}
                  >
                    {isPlayingMusic ? <Volume2 className="w-3.5 md:w-4 h-3.5 md:h-4 animate-pulse" /> : <VolumeX className="w-3.5 md:w-4 h-3.5 md:h-4" />}
                  </button>

                  <div className="flex-grow space-y-0.5 md:space-y-1">
                    <div className="flex justify-between text-[8px] md:text-[9px] font-mono text-purple-400">
                      <span>VOLUMEN DEL DRONE</span>
                      <span>{(volume * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.05"
                      value={volume}
                      disabled={!isPlayingMusic}
                      onChange={(e) => adjustVolume(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-jupiter-ochre disabled:opacity-30"
                    />
                  </div>
                </div>
                {!isPlayingMusic && (
                  <p className="text-[9px] md:text-[10px] font-sans text-jupiter-light italic leading-snug">
                    🔊 Haz clic en el botón de altavoz para encender un sintetizador en vivo que genera misteriosas atmósferas espaciales.
                  </p>
                )}
              </div>
            </div>

            {/* MESSAGE DETAILS DECK */}
            <div className="flex-grow">
              <DedicationCard 
                star={selectedStar} 
                onClose={() => setSelectedStar(null)}
              />
            </div>

          </div>
        </section>

        {/* LOWER SECTION: JUPITER METAPHOR BENTO */}
        <section className="pt-4">
          
          {/* POETIC AND HISTORIC INFORMATION PANEL */}
          <div className="artistic-card p-4 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-jupiter-ochre/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-mono text-jupiter-light justify-center">
                <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-jupiter-light text-jupiter-light" />
                <span>ALINEACIÓN CELESTIAL • 17 DE JULIO</span>
              </div>
              <h3 className="text-lg md:text-2xl font-space font-extrabold text-white tracking-wide title-gradient text-center">
                La Paradoja de la Atracción
              </h3>
              <p className="text-xs md:text-sm text-[#e0d8d0] leading-relaxed font-serif italic max-w-2xl text-center">
                "En astrofísica, existe un término llamado <strong className="text-white font-sans not-italic font-bold">Límite de Roche</strong>, la distancia mínima a la que un objeto celeste puede acercarse a otro masivo sin desintegrarse por las fuerzas de marea."
              </p>
              <p className="text-xs md:text-sm text-[#e0d8d0] leading-relaxed font-serif italic max-w-3xl text-center font-normal">
                "Contigo, {targetName}, esa paradoja se rompe por completo. La gravedad de tu alegría, tu mirada y tu luz me atrae tanto que rompo cualquier límite físico imaginable. No me desintegro; al contrario, es en tu órbita donde encuentro mi verdadera armonía y orden cósmico. Eres el Júpiter de mi pequeño universo errante."
              </p>
              
              <div className="grid grid-cols-3 gap-2 md:gap-6 pt-3 md:pt-4 font-mono text-[9px] md:text-[10px] w-full max-w-lg">
                <div className="bg-white/5 p-2 md:p-3.5 rounded-lg border border-white/10 text-center">
                  <span className="text-purple-400 block mb-0.5 uppercase tracking-wider">Atracción</span>
                  <span className="text-jupiter-light font-bold font-space text-[10px] md:text-xs">INFINITA</span>
                </div>
                <div className="bg-white/5 p-2 md:p-3.5 rounded-lg border border-white/10 text-center">
                  <span className="text-purple-400 block mb-0.5 uppercase tracking-wider">Vel. Escape</span>
                  <span className="text-red-400 font-bold font-space text-[10px] md:text-xs">0.00 km/s</span>
                </div>
                <div className="bg-white/5 p-2 md:p-3.5 rounded-lg border border-white/10 text-center">
                  <span className="text-purple-400 block mb-0.5 uppercase tracking-wider">Destino</span>
                  <span className="text-pink-400 font-bold font-space text-[10px] md:text-xs">COINCIDIR</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 md:pt-6 mt-4 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-purple-300/60 font-mono mx-auto sm:mx-0">
                <Clock className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 animate-spin-slow" />
                <span>Sincronía estelar hoy, 17 de Julio, asegurada</span>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* COMPACT FOOTER */}
      <footer className="border-t border-white/10 bg-[#050510]/80 py-4 md:py-6 text-center text-[10px] md:text-xs font-mono text-purple-400/50 relative z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
          <p>© 2026 • Diseñado con atracción ineludible bajo la influencia de Júpiter.</p>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="inline-block w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500"></span>
            <span>MOTOR DE FÍSICA GRAVITATORIA ACTIVO</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
