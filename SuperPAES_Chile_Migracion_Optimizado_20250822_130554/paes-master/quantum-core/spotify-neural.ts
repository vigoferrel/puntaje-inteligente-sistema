/**
 * 🎵 PAES MASTER QUANTUM - Spotify Neural
 * Sistema de música adaptativa para estudio PAES
 */

import { 
  PaesTestType,
  PaesSkill,
  BloomLevel,
  SpotifyNeural,
  QuantumState
} from './paes-types';

export class SpotifyNeuralSystem {
  private quantumState: QuantumState;
  private playlists: Map<string, SpotifyNeural>;

  constructor(quantumState: QuantumState) {
    this.quantumState = quantumState;
    this.playlists = new Map();
    this.initializeNeuralPlaylists();
  }

  private initializeNeuralPlaylists() {
    // Matemática M1
    this.createPlaylist('MATEMATICA_M1', 'Números', 'Enteros', [
      { name: 'Números Enteros', bloomLevel: 'L1', duration: 180 },
      { name: 'Operaciones Básicas', bloomLevel: 'L2', duration: 240 },
      { name: 'Problemas Aplicados', bloomLevel: 'L3', duration: 300 }
    ]);

    this.createPlaylist('MATEMATICA_M1', 'Álgebra', 'Básica', [
      { name: 'Expresiones Algebraicas', bloomLevel: 'L1', duration: 200 },
      { name: 'Factorización', bloomLevel: 'L2', duration: 250 },
      { name: 'Ecuaciones', bloomLevel: 'L3', duration: 300 }
    ]);

    // Matemática M2
    this.createPlaylist('MATEMATICA_M2', 'Probabilidad', 'Eventos', [
      { name: 'Conceptos Básicos', bloomLevel: 'L1', duration: 180 },
      { name: 'Probabilidad Simple', bloomLevel: 'L2', duration: 240 },
      { name: 'Probabilidad Compuesta', bloomLevel: 'L3', duration: 300 }
    ]);

    // Competencia Lectora
    this.createPlaylist('COMPETENCIA_LECTORA', 'Localizar', 'Información explícita', [
      { name: 'Lectura Activa', bloomLevel: 'L1', duration: 180 },
      { name: 'Identificación de Datos', bloomLevel: 'L2', duration: 240 },
      { name: 'Análisis de Textos', bloomLevel: 'L3', duration: 300 }
    ]);
  }

  private createPlaylist(
    testType: PaesTestType,
    skill: PaesSkill,
    subSkill: string,
    tracks: Array<{name: string; bloomLevel: BloomLevel; duration: number}>
  ) {
    const playlistId = `${testType}-${skill}-${subSkill}`;
    
    const playlist: SpotifyNeural = {
      playlistId,
      testType,
      skill,
      subSkill,
      tracks: tracks.map((track, index) => ({
        trackId: `${playlistId}-${index}`,
        name: track.name,
        bloomLevel: track.bloomLevel,
        duration: track.duration
      })),
      neuralSync: true
    };

    this.playlists.set(playlistId, playlist);
  }

  findOptimalTrack(
    testType: PaesTestType,
    skill: PaesSkill,
    subSkill: string,
    bloomLevel: BloomLevel
  ) {
    const playlistId = `${testType}-${skill}-${subSkill}`;
    const playlist = this.playlists.get(playlistId);
    
    if (!playlist) return null;

    // Encontrar track que coincida con el nivel Bloom
    const track = playlist.tracks.find(t => t.bloomLevel === bloomLevel);
    if (track) return track;

    // Si no hay coincidencia exacta, buscar el más cercano
    const level = parseInt(bloomLevel.slice(1));
    return playlist.tracks.reduce((best, current) => {
      const currentLevel = parseInt(current.bloomLevel.slice(1));
      const bestLevel = parseInt(best.bloomLevel.slice(1));
      
      return Math.abs(currentLevel - level) < Math.abs(bestLevel - level)
        ? current
        : best;
    });
  }

  createAdaptivePlaylist(
    testType: PaesTestType,
    skill: PaesSkill,
    subSkill: string,
    bloomLevel: BloomLevel,
    duration: number = 1800 // 30 minutos por defecto
  ) {
    const tracks = [];
    let totalDuration = 0;
    
    // Obtener tracks del nivel actual
    const mainTrack = this.findOptimalTrack(testType, skill, subSkill, bloomLevel);
    if (mainTrack) {
      tracks.push(mainTrack);
      totalDuration += mainTrack.duration;
    }

    // Obtener tracks de niveles adyacentes
    const currentLevel = parseInt(bloomLevel.slice(1));
    
    // Nivel anterior
    if (currentLevel > 1) {
      const prevLevel = `L${currentLevel - 1}` as BloomLevel;
      const prevTrack = this.findOptimalTrack(testType, skill, subSkill, prevLevel);
      if (prevTrack) {
        tracks.push(prevTrack);
        totalDuration += prevTrack.duration;
      }
    }

    // Siguiente nivel
    if (currentLevel < 6) {
      const nextLevel = `L${currentLevel + 1}` as BloomLevel;
      const nextTrack = this.findOptimalTrack(testType, skill, subSkill, nextLevel);
      if (nextTrack) {
        tracks.push(nextTrack);
        totalDuration += nextTrack.duration;
      }
    }

    // Ajustar duración si es necesario
    while (totalDuration < duration && tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      tracks.push(randomTrack);
      totalDuration += randomTrack.duration;
    }

    return {
      id: `adaptive-${testType}-${skill}-${subSkill}-${bloomLevel}`,
      name: `Playlist Adaptativa - ${skill} ${subSkill} (Nivel ${bloomLevel})`,
      tracks: tracks.map((track, index) => ({
        ...track,
        position: index + 1
      })),
      totalDuration,
      bloomLevel,
      testType,
      skill,
      subSkill,
      neuralSync: true
    };
  }

  syncWithQuantumState() {
    // Actualizar estado cuántico
    this.quantumState.spotify = {
      playlists: Array.from(this.playlists.values()),
      neuralSync: true
    };

    // Calcular coherencia basada en playlists
    const totalPlaylists = this.playlists.size;
    const activePlaylists = Array.from(this.playlists.values())
      .filter(p => p.neuralSync).length;
    
    const coherence = activePlaylists / totalPlaylists;
    this.quantumState.coherence = Math.max(
      this.quantumState.coherence,
      coherence
    );

    return {
      playlists: this.playlists.size,
      tracks: Array.from(this.playlists.values())
        .reduce((sum, p) => sum + p.tracks.length, 0),
      coherence: this.quantumState.coherence
    };
  }

  getPlaylistsForTest(testType: PaesTestType) {
    return Array.from(this.playlists.values())
      .filter(p => p.testType === testType);
  }

  getPlaylistsForSkill(skill: PaesSkill) {
    return Array.from(this.playlists.values())
      .filter(p => p.skill === skill);
  }

  getPlaylistsForBloomLevel(bloomLevel: BloomLevel) {
    return Array.from(this.playlists.values())
      .filter(p => p.tracks.some(t => t.bloomLevel === bloomLevel));
  }
}


