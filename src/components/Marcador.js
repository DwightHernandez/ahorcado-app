import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';

export default function Marcador({ puntaje, errores, tiempoRestante }) {
  const { tema } = useTema();
  const vidas = Math.max(0, 6 - errores);

  return (
    <View style={styles.contenedor}>
      <View style={[styles.tarjeta, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
        <Text style={styles.icono}>✦</Text>
        <Text style={[styles.etiqueta, { color: tema.texto }]}>PUNTOS</Text>
        <Text style={[styles.valor, { color: tema.texto }]}>{puntaje}</Text>
      </View>

      <View style={[styles.tarjeta, styles.tarjetaVidas, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
        <View style={styles.corazones}>
          {Array.from({ length: 6 }, (_, index) => (
            <Text key={index} style={[styles.corazon, { color: index < vidas ? '#F45B78' : tema.borde }]}>
              ♥
            </Text>
          ))}
        </View>
        <Text style={[styles.etiqueta, { color: tema.texto }]}>VIDAS</Text>
        <Text style={[styles.valor, { color: vidas <= 2 ? tema.error : tema.texto }]}>{vidas} / 6</Text>
      </View>

      {tiempoRestante !== null && (
        <View style={[styles.tarjeta, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
          <Text style={styles.icono}>◷</Text>
          <Text style={[styles.etiqueta, { color: tema.texto }]}>TIEMPO</Text>
          <Text style={[styles.valor, { color: tiempoRestante <= 10 ? tema.error : tema.texto }]}>
            {tiempoRestante}s
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexDirection: 'row', gap: 10, width: '90%', maxWidth: 420, marginBottom: 14 },
  tarjeta: {
    flex: 1,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 18,
    borderWidth: 1,
  },
  tarjetaVidas: { flex: 1.35 },
  icono: { color: '#FFB84D', fontSize: 17, fontWeight: '800', height: 22 },
  corazones: { flexDirection: 'row', height: 22, alignItems: 'center', gap: 2 },
  corazon: { fontSize: 13 },
  etiqueta: { fontSize: 10, fontWeight: '800', letterSpacing: 1, opacity: 0.7 },
  valor: { fontSize: 19, fontWeight: '800', marginTop: 3 },
});
