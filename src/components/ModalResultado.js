import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';

export default function ModalResultado({ visible, estadoPartida, palabra, puntaje, onJugarDeNuevo, onMenu }) {
  const { tema, modoOscuro } = useTema();
  const esVictoria = estadoPartida === 'ganado';
  const acento = esVictoria ? tema.acierto : tema.error;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onMenu}
    >
      <View style={styles.fondo}>
        <View style={[styles.tarjeta, { backgroundColor: tema.fondo, borderColor: tema.borde }]}>
          <View style={[styles.sello, { backgroundColor: acento + '22' }]}>
            <Text style={[styles.icono, { color: acento }]}>{esVictoria ? '✦' : '↻'}</Text>
          </View>

          <Text style={[styles.titulo, { color: tema.texto }]}>
            {esVictoria ? '¡Lo lograste!' : '¡Sigue intentando!'}
          </Text>
          <Text style={[styles.subtitulo, { color: tema.texto }]}>
            {esVictoria ? 'Adivinaste la palabra' : 'La palabra era'}
          </Text>
          <Text style={[styles.palabra, { color: acento }]}>{palabra}</Text>

          <View style={[styles.puntaje, { backgroundColor: tema.teclaHabilitada }]}>
            <Text style={[styles.puntajeEtiqueta, { color: tema.texto }]}>Puntaje final</Text>
            <Text style={[styles.puntajeValor, { color: tema.texto }]}>{puntaje}</Text>
          </View>

          <View style={styles.botones}>
            <Pressable
              accessibilityRole="button"
              onPress={onJugarDeNuevo}
              style={({ pressed }) => [styles.botonPrincipal, { backgroundColor: tema.primario }, pressed && styles.presionado]}
            >
              <Text style={[styles.textoBotonPrincipal, { color: modoOscuro ? tema.fondo : '#FFFFFF' }]}>Jugar de nuevo</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onMenu}
              style={({ pressed }) => [styles.botonSecundario, { borderColor: tema.borde }, pressed && styles.presionado]}
            >
              <Text style={[styles.textoBotonSecundario, { color: tema.texto }]}>Volver al menú</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(9, 15, 30, 0.72)' },
  tarjeta: { width: '100%', maxWidth: 380, alignItems: 'center', padding: 26, borderRadius: 28, borderWidth: 1, elevation: 16 },
  sello: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 36, marginBottom: 14 },
  icono: { fontSize: 34, fontWeight: '900' },
  titulo: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitulo: { fontSize: 15, opacity: 0.7, marginTop: 8 },
  palabra: { fontSize: 23, fontWeight: '900', textAlign: 'center', marginTop: 7, letterSpacing: 1 },
  puntaje: { width: '100%', alignItems: 'center', padding: 14, borderRadius: 16, marginTop: 20 },
  puntajeEtiqueta: { fontSize: 12, fontWeight: '700', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 },
  puntajeValor: { fontSize: 25, fontWeight: '900', marginTop: 3 },
  botones: { width: '100%', gap: 10, marginTop: 20 },
  botonPrincipal: { minHeight: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  textoBotonPrincipal: { fontSize: 16, fontWeight: '800' },
  botonSecundario: { minHeight: 50, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  textoBotonSecundario: { fontSize: 15, fontWeight: '700' },
  presionado: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
