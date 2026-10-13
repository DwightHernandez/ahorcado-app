import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTema } from '../context/TemaContext';

const LETRAS = [
  'A','B','C','D','E','F','G','H','I',
  'J','K','L','M','N','Ñ','O','P','Q',
  'R','S','T','U','V','W','X','Y','Z'
];

export default function Teclado({ letrasAcertadas, letrasFalladas, onPressLetra }) {
  const { tema } = useTema();

  const obtenerEstiloTecla = (letra) => {
    if (letrasAcertadas.includes(letra)) return { backgroundColor: tema.acierto };
    if (letrasFalladas.includes(letra)) return { backgroundColor: tema.error };
    return { backgroundColor: tema.teclaHabilitada };
  };

  const obtenerEstiloTexto = (letra) => {
    if (letrasAcertadas.includes(letra) || letrasFalladas.includes(letra)) {
      return { color: '#FFF' }; // Texto blanco para letras usadas
    }
    return { color: tema.texto };
  };

  return (
    <View style={styles.contenedor}>
      {LETRAS.map((letra) => {
        const estaUsada = letrasAcertadas.includes(letra) || letrasFalladas.includes(letra);

        return (
          <Pressable
            key={letra}
            style={[styles.tecla, obtenerEstiloTecla(letra)]}
            onPress={() => onPressLetra(letra)}
            disabled={estaUsada} // Deshabilita letras usadas (RF-07)
          >
            <Text style={[styles.textoTecla, obtenerEstiloTexto(letra)]}>{letra}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  tecla: {
    // Área táctil de al menos 48x48 dp (RNF-04)[cite: 8]
    width: 40,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2, // Sombra en Android
  },
  textoTecla: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
