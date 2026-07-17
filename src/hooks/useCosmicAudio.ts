import { useEffect, useRef, useState } from 'react';

export function useCosmicAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Lazy initialize AudioContext
  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Standard cross-browser support
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Biquad Filter to make drones warm and soft (shaving off harsh high frequencies)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);
    filter.connect(masterGain);
    filterRef.current = filter;

    // Start deep space ambient drone pad
    // Cmaj9 chord: C2 (65.41), G2 (98.0), C3 (130.8), E3 (164.8), B3 (246.9), D4 (293.7)
    const frequencies = [65.41, 98.0, 130.81, 164.81, 246.94, 293.66];
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Use triangle waves for soft, flute-like cosmic tones
      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Create subtle pitch detuning for beautiful chorus effects
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, ctx.currentTime);

      // Separate volume levels to balance the chord
      // Low base notes louder, high notes quieter
      const oscVol = index < 2 ? 0.25 : 0.12;
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Smooth fade-in of the drone
      oscGain.gain.linearRampToValueAtTime(oscVol, ctx.currentTime + 3.0);

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start();
      oscillatorsRef.current.push(osc);
    });

    // Slow Filter modulation LFO to simulate drifting nebulas
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // 1 sweep every ~12 seconds
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime); // sweeps filter up and down by 250Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    lfo.start();
    lfoRef.current = lfo;
  };

  const startMusic = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (masterGainRef.current) {
      // Fade volume in smoothly
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current!.currentTime);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, audioCtxRef.current!.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current!.currentTime + 1.5);
    }
    
    setIsPlaying(true);
  };

  const stopMusic = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      // Fade volume out smoothly
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, audioCtxRef.current.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.0);
      
      // Suspend audio context after fade-out completes
      setTimeout(() => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running' && !isPlaying) {
          // Double check if it wasn't restarted in between
          audioCtxRef.current.suspend();
        }
      }, 1100);
    }
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Adjust overall volume
  const adjustVolume = (newVol: number) => {
    setVolume(newVol);
    if (audioCtxRef.current && masterGainRef.current && isPlaying) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Trigger a cosmic chime/bell sound when interacting with stars
  const playStarTwinkle = (frequencyMultiplier = 1.0) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;

    const ctx = audioCtxRef.current;
    
    // Choose beautiful pentatonic frequencies for high cosmic bells
    // C5 (523.25), D5 (587.33), E5 (659.25), G5 (783.99), A5 (880.00), C6 (1046.50)
    const baseBells = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const randomIndex = Math.floor(Math.random() * baseBells.length);
    const targetFreq = baseBells[randomIndex] * frequencyMultiplier;

    // Osc 1 (Main bell tone)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

    // Osc 2 (Subtle metallic tone, slightly detuned)
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = 'triangle';
    harmonicOsc.frequency.setValueAtTime(targetFreq * 1.5, ctx.currentTime);

    // Filter to soften the sparkle
    const chimeFilter = ctx.createBiquadFilter();
    chimeFilter.type = 'lowpass';
    chimeFilter.frequency.setValueAtTime(3000, ctx.currentTime);

    // Delay/Echo effect simulation
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.35, ctx.currentTime);

    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.4, ctx.currentTime); // Echo volume

    // Wire up delay feedback loop
    delay.connect(delayGain);
    delayGain.connect(delay); // Feedback

    // Node routing
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8); // Long bell decay

    harmonicGain.gain.setValueAtTime(0.02, ctx.currentTime);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6); // Shorter decay for harmonic

    osc.connect(gain);
    harmonicOsc.connect(harmonicGain);

    // Connect both oscillators to filter
    gain.connect(chimeFilter);
    harmonicGain.connect(chimeFilter);

    // Connect filter to main output
    chimeFilter.connect(masterGainRef.current!);
    
    // Connect filter to echo delay loop
    chimeFilter.connect(delay);
    delayGain.connect(masterGainRef.current!);

    osc.start();
    harmonicOsc.start();

    osc.stop(ctx.currentTime + 2.0);
    harmonicOsc.stop(ctx.currentTime + 2.0);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        oscillatorsRef.current.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        if (lfoRef.current) {
          try { lfoRef.current.stop(); } catch(e) {}
        }
        audioCtxRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    volume,
    startMusic,
    stopMusic,
    toggleMusic,
    adjustVolume,
    playStarTwinkle
  };
}
