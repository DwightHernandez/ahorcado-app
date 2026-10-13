import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';

const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export default function PalabraOculta({ palabra, letrasAcertadas }) {
  const { tema } = useTema();

  return (
    <View style={styles.contenedor} accessibilityLabel="Palabra por adivinar">
      {[...palabra].map((letraOriginal, index) => {
        if (letraOriginal === ' ') return <View key={`espacio-${index}`} style={styles.espacio} />;

        const visible = letrasAcertadas.includes(normalizar(letraOriginal));

        return (
          <View
            key={`${letraOriginal}-${index}`}
            style={[
              styles.cajaLetra,
              { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde },
              visible && { borderColor: tema.primario },
            ]}
          >
            <Text style={[styles.textoLetra, { color: tema.texto }]}>{visible ? letraOriginal : ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 6,
    columnGap: 5,
    rowGap: 7,
  },
  cajaLetra: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderRadius: 7,
  },
  textoLetra: { fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  espacio: { width: 14, height: 38 },
});
