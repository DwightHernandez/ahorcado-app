// src/storage/almacenamiento.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves exigidas por el modelo de datos[cite: 9]
const KEYS = {
  STATS: '@ahorcado_stats',
  RANKING: '@ahorcado_ranking',
  CONFIG: '@ahorcado_config'
};

// --- CONFIGURACIÓN ---
export const guardarConfiguracion = async (config) => {
  try {
    await AsyncStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Error guardando configuración", e);
  }
};

export const cargarConfiguracion = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.CONFIG);
    return jsonValue != null ? JSON.parse(jsonValue) : { sonido: true, vibracion: true, tema: 'claro' };
  } catch (e) {
    console.error("Error cargando configuración", e);
    return { sonido: true, vibracion: true, tema: 'claro' };
  }
};

// --- ESTADÍSTICAS ---
export const actualizarEstadisticas = async (esVictoria) => {
  try {
    const statsActuales = await cargarEstadisticas();
    
    let nuevasStats = { ...statsActuales };
    nuevasStats.jugadas += 1;
    
    if (esVictoria) {
      nuevasStats.ganadas += 1;
      nuevasStats.rachaActual += 1;
      if (nuevasStats.rachaActual > nuevasStats.mejorRacha) {
        nuevasStats.mejorRacha = nuevasStats.rachaActual;
      }
    } else {
      nuevasStats.perdidas += 1;
      nuevasStats.rachaActual = 0; // Se rompe la racha al perder
    }

    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(nuevasStats));
  } catch (e) {
    console.error("Error actualizando estadísticas", e);
  }
};

export const cargarEstadisticas = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.STATS);
    // Modelo inicial de estadísticas si está vacío[cite: 9]
    return jsonValue != null ? JSON.parse(jsonValue) : { jugadas: 0, ganadas: 0, perdidas: 0, rachaActual: 0, mejorRacha: 0 };
  } catch (e) {
    console.error("Error cargando estadísticas", e);
    return { jugadas: 0, ganadas: 0, perdidas: 0, rachaActual: 0, mejorRacha: 0 };
  }
};

// --- RANKING (Top 10) ---
export const guardarPuntaje = async (nombre, puntaje, categoria, nivel) => {
  if (puntaje <= 0) return; // Opcional: no guardar puntajes nulos o negativos

  try {
    const rankingActual = await cargarRanking();
    
    const nuevoRegistro = {
      id: Date.now().toString(),
      nombre,
      puntaje,
      categoria,
      nivel,
      fecha: new Date().toLocaleDateString()
    };

    // Agregar el nuevo puntaje, ordenar de mayor a menor y mantener solo el Top 10[cite: 6, 9]
    const nuevoRanking = [...rankingActual, nuevoRegistro]
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 10); 

    await AsyncStorage.setItem(KEYS.RANKING, JSON.stringify(nuevoRanking));
  } catch (e) {
    console.error("Error guardando puntaje", e);
  }
};

export const cargarRanking = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.RANKING);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error cargando ranking", e);
    return [];
  }
};

// --- BORRADO (RF-14 / Configuración) ---
export const borrarDatosLocales = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.STATS, KEYS.RANKING]);
    return true;
  } catch (e) {
    console.error("Error borrando datos", e);
    return false;
  }
};