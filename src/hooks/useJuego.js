// src/hooks/useJuego.js
import { useState, useEffect, useCallback } from 'react';
import { PALABRAS } from '../data/palabras';
import { actualizarEstadisticas } from '../storage/almacenamiento';

const quitarTildes = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};

export const useJuego = (categoria, nivel) => {
  const [estado, setEstado] = useState({
    palabra: '',
    pista: '',
    letrasAcertadas: [],
    letrasFalladas: [],
    errores: 0,
    pistasDisponibles: 1,
    mostrarTextoPista: false, // <-- NUEVO: Controla si se muestra el texto en pantalla
    puntaje: 0,
    tiempoRestante: null,
    estado: 'jugando' 
  });

  const iniciarPartida = useCallback(() => {
    const palabrasFiltradas = PALABRAS.filter(p => 
      (categoria === 'Aleatoria' || p.categoria === categoria) && p.nivel === nivel
    );
    
    if (palabrasFiltradas.length === 0) return; 

    const seleccion = palabrasFiltradas[Math.floor(Math.random() * palabrasFiltradas.length)];
    const pistas = nivel === 'Fácil' ? 2 : (nivel === 'Medio' ? 1 : 0);
    const tiempo = nivel === 'Difícil' ? 90 : null;

    setEstado({
      palabra: seleccion.palabra.toUpperCase(),
      pista: seleccion.pista,
      letrasAcertadas: [],
      letrasFalladas: [],
      errores: 0,
      pistasDisponibles: pistas,
      mostrarTextoPista: false, 
      puntaje: 0,
      tiempoRestante: tiempo,
      estado: 'jugando'
    });
  }, [categoria, nivel]);

  useEffect(() => {
    iniciarPartida();
  }, [iniciarPartida]);

  useEffect(() => {
    if (estado.estado === 'jugando' && estado.tiempoRestante !== null && estado.tiempoRestante > 0) {
      const timerId = setTimeout(() => {
        setEstado(prev => ({ ...prev, tiempoRestante: prev.tiempoRestante - 1 }));
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (estado.tiempoRestante === 0 && estado.estado === 'jugando') {
      setEstado(prev => ({ ...prev, estado: 'perdido' })); 
      actualizarEstadisticas(false); 
    }
  }, [estado.tiempoRestante, estado.estado]);

  const jugarLetra = (letra) => {
    if (estado.estado !== 'jugando') return;

    const palabraLimpia = quitarTildes(estado.palabra);
    const esAcierto = palabraLimpia.includes(letra);

    setEstado(prev => {
      if (prev.letrasAcertadas.includes(letra) || prev.letrasFalladas.includes(letra)) return prev;

      let nuevoEstado = { ...prev };
      const multiplicador = nivel === 'Fácil' ? 1 : (nivel === 'Medio' ? 2 : 3); 

      if (esAcierto) {
        nuevoEstado.letrasAcertadas = [...prev.letrasAcertadas, letra];
        const ocurrencias = palabraLimpia.split('').filter(l => l === letra).length;
        nuevoEstado.puntaje += (ocurrencias * 10);

        const letrasUnicas = [...new Set(palabraLimpia.replace(/ /g, '').split(''))];
        const todasAcertadas = letrasUnicas.every(l => nuevoEstado.letrasAcertadas.includes(l));

        if (todasAcertadas) {
          nuevoEstado.estado = 'ganado';
          const vidasRestantes = 6 - nuevoEstado.errores;
          nuevoEstado.puntaje = (nuevoEstado.puntaje + 50 + (vidasRestantes * 10)) * multiplicador;
          actualizarEstadisticas(true); 
        }
      } else {
        nuevoEstado.letrasFalladas = [...prev.letrasFalladas, letra];
        nuevoEstado.errores += 1; 
        nuevoEstado.puntaje -= 5; 

        if (nuevoEstado.errores >= 6) {
          nuevoEstado.estado = 'perdido';
          nuevoEstado.puntaje = nuevoEstado.puntaje * multiplicador; 
          actualizarEstadisticas(false); 
        }
      }
      return nuevoEstado;
    });
  };

  const usarPista = () => {
    if (estado.pistasDisponibles > 0 && estado.estado === 'jugando') {
      setEstado(prev => {
        let nuevoEstado = {
          ...prev,
          pistasDisponibles: prev.pistasDisponibles - 1,
          puntaje: prev.puntaje - 15 
        };

        const pistasIniciales = nivel === 'Fácil' ? 2 : (nivel === 'Medio' ? 1 : 0);
        const esPrimeraPista = (pistasIniciales - prev.pistasDisponibles) === 0;

        if (esPrimeraPista) {
          // Primera pista: muestra la descripción
          nuevoEstado.mostrarTextoPista = true;
        } else {
          // Segunda pista (solo en Fácil): revela una letra al azar
          const palabraLimpia = quitarTildes(prev.palabra);
          const letrasFaltantes = palabraLimpia.split('').filter(l => l !== ' ' && !prev.letrasAcertadas.includes(l));
          
          if (letrasFaltantes.length > 0) {
            const letraAzar = letrasFaltantes[Math.floor(Math.random() * letrasFaltantes.length)];
            nuevoEstado.letrasAcertadas = [...prev.letrasAcertadas, letraAzar];
            
            // Verificación de victoria en caso de que la pista revele la última letra
            const letrasUnicas = [...new Set(palabraLimpia.replace(/ /g, '').split(''))];
            const todasAcertadas = letrasUnicas.every(l => nuevoEstado.letrasAcertadas.includes(l));
            
            if (todasAcertadas) {
              nuevoEstado.estado = 'ganado';
              const vidasRestantes = 6 - nuevoEstado.errores;
              nuevoEstado.puntaje = (nuevoEstado.puntaje + 50 + (vidasRestantes * 10)) * 1; 
              actualizarEstadisticas(true);
            }
          }
        }
        return nuevoEstado;
      });
    }
  };

  return { estado, jugarLetra, iniciarPartida, usarPista };
};