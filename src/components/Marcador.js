// src/components/Marcador.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../context/TemaContext';

export default function Marcador({ puntaje, errores, tiempoRestante }) {
  const { tema } = useTema();
  const vidas = 6 - errores;

  return (
    <View style={[styles.contenedor, { backgroundColor: tema.teclaHabilitada }]}>
      <View style={styles.seccion}>
        <Text style={[styles.etiqueta, { color: tema.texto }]}>Puntos</Text>
        <Text style={[styles.valor, { color: tema.texto }]}>{puntaje}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={[styles.etiqueta, { color: tema.texto }]}>Vidas</Text>
        <Text style={[styles.valor, vidas <= 2 && { color: tema.error }]}>
          {vidas}
        </Text>
      </View>

      {/* Solo se muestra si hay un cronómetro activo (Nivel Difícil)[cite: 7] */}
      {tiempoRestante !== null && (
        <View style={styles.seccion}>
        <Text style={[styles.etiqueta, { color: tema.texto }]}>Tiempo</Text>
          <Text style={[styles.valor, tiempoRestante <= 10 && { color: tema.error }]}>
            {tiempoRestante}s
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 15,
  },
  seccion: {
    alignItems: 'center',
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
  }
});
