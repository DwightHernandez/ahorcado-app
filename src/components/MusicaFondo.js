import { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useTema } from '../context/TemaContext';

const FUENTE_MUSICA = require('../../assets/sonidos/periwinkle.mp3');

export default function MusicaFondo() {
  const { sonidoActivo } = useTema();
  const reproductor = useAudioPlayer(FUENTE_MUSICA);

  useEffect(() => {
    let activo = true;

    // AudioPlayer expone loop y volume como propiedades mutables del reproductor nativo.
    // eslint-disable-next-line react-hooks/immutability
    reproductor.loop = true;
    reproductor.volume = 0.2;

    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    })
      .then(() => {
        if (!activo) return;
        if (sonidoActivo) reproductor.play();
        else reproductor.pause();
      })
      .catch((error) => {
        console.warn('No se pudo configurar el audio:', error);
      });

    return () => {
      activo = false;
      reproductor.pause();
    };
  }, [reproductor, sonidoActivo]);

  return null;
}
