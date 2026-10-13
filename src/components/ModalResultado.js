// src/components/ModalResultado.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTema } from '../context/TemaContext';

export default function ModalResultado({ visible, estadoPartida, palabra, puntaje, onJugarDeNuevo, onMenu }) { // Verifica que onMenu esté aquí
  const { tema } = useTema();
  const esVictoria = estadoPartida === 'ganado';

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.fondoGris}>
        <View style={[styles.tarjeta, { backgroundColor: tema.fondo }]}>
          <Text style={[styles.titulo, { color: esVictoria ? tema.acierto : tema.error }]}>
            {esVictoria ? '¡VICTORIA!' : 'FIN DEL JUEGO'}
          </Text>
          
          <Text style={[styles.texto, { color: tema.texto }]}>La palabra era:</Text>
          <Text style={[styles.palabra, { color: tema.texto }]}>{palabra}</Text>
          
          <Text style={[styles.texto, { color: tema.texto }]}>Puntaje: {puntaje}</Text>

          <View style={styles.botones}>
            <Pressable style={[styles.boton, { backgroundColor: tema.primario }]} onPress={onJugarDeNuevo}>
              <Text style={styles.textoBoton}>Jugar de nuevo</Text>
            </Pressable>
            {/* Verifica que onPress={onMenu} esté configurado aquí */}
            <Pressable style={[styles.boton, { backgroundColor: tema.teclaDeshabilitada }]} onPress={onMenu}>
              <Text style={styles.textoBoton}>Volver al Inicio</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondoGris: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjeta: {
    width: '85%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    marginVertical: 5,
  },
  palabra: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    letterSpacing: 2,
  },
  botones: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  boton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
