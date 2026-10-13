// src/components/PalabraOculta.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../context/TemaContext';

export default function PalabraOculta({ palabra, letrasAcertadas }) {
  const { tema } = useTema();

  const quitarTildes = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  return (
    <View style={styles.contenedor}>
      {palabra.split('').map((letraOriginal, index) => {
        // Separador para palabras compuestas
        if (letraOriginal === ' ') {
          return <View key={index} style={styles.espacio} />;
        }

        const letraSinTilde = quitarTildes(letraOriginal);
        const estaDescubierta = letrasAcertadas.includes(letraSinTilde);

        return (
          <View key={index} style={[styles.cajaLetra, { borderBottomColor: tema.texto }]}>
            {/* Solo se renderiza la letra si fue descubierta, de lo contrario un espacio vacío */}
            <Text style={[styles.textoLetra, { color: tema.texto }]}>
              {estaDescubierta ? letraOriginal : ' '}
            </Text>
          </View>
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
    marginVertical: 20,
    paddingHorizontal: 10,
    gap: 8,
  },
  cajaLetra: {
    width: 32,
    height: 45, // Altura fija para que la línea base no se deforme
    justifyContent: 'flex-end', // Empuja el texto hacia la línea inferior
    alignItems: 'center',
    borderBottomWidth: 3, // Línea base más gruesa y visible
    marginHorizontal: 3,
  },
  textoLetra: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2, // Separación de 2px respecto a la línea base
  },
  espacio: {
    width: 20, 
  }
});
