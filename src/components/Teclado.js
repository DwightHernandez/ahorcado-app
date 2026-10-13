import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';

const FILAS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];

export default function Teclado({ letrasAcertadas, letrasFalladas, onPressLetra, bloqueado = false }) {
  const { tema, modoOscuro } = useTema();

  return (
    <View style={styles.contenedor} accessibilityLabel="Teclado del juego">
      {FILAS.map((fila, indice) => (
        <View key={fila} style={[styles.fila, indice === 1 && styles.filaMedia, indice === 2 && styles.filaInferior]}>
          {[...fila].map((letra) => {
            const acertada = letrasAcertadas.includes(letra);
            const fallada = letrasFalladas.includes(letra);
            const usada = acertada || fallada;
            const colorFondo = acertada ? tema.acierto : fallada ? tema.error : tema.teclaHabilitada;
            const colorTexto = usada ? (modoOscuro ? tema.fondo : '#FFFFFF') : tema.texto;

            return (
              <Pressable
                key={letra}
                accessibilityRole="button"
                accessibilityLabel={`Letra ${letra}${acertada ? ', correcta' : fallada ? ', incorrecta' : ''}`}
                accessibilityState={{ disabled: usada || bloqueado }}
                disabled={usada || bloqueado}
                onPress={() => onPressLetra(letra)}
                android_ripple={{ color: '#FFFFFF33', borderless: false }}
                style={({ pressed }) => [
                  styles.tecla,
                  { backgroundColor: colorFondo },
                  pressed && styles.teclaPresionada,
                  bloqueado && styles.teclaBloqueada,
                ]}
              >
                <Text style={[styles.textoTecla, { color: colorTexto }]}>{letra}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { width: '100%', maxWidth: 480, gap: 8, paddingHorizontal: 2 },
  fila: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  filaMedia: { paddingHorizontal: '4%' },
  filaInferior: { paddingHorizontal: '13%' },
  tecla: {
    flex: 1,
    height: 46,
    maxWidth: 44,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFFFFF22',
    overflow: 'hidden',
    elevation: 2,
  },
  teclaPresionada: { transform: [{ scale: 0.94 }], opacity: 0.82 },
  teclaBloqueada: { opacity: 0.68 },
  textoTecla: { fontSize: 16, fontWeight: '800' },
});
