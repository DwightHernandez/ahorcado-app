// src/screens/JuegoScreen.js
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useJuego } from '../hooks/useJuego';
import { useTema } from '../context/TemaContext';
import { guardarPuntaje } from '../storage/almacenamiento'; 

// Componentes
import Ahorcado from '../components/Ahorcado';
import PalabraOculta from '../components/PalabraOculta';
import Teclado from '../components/Teclado';
import Marcador from '../components/Marcador';
import ModalResultado from '../components/ModalResultado';

const quitarTildes = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

export default function JuegoScreen({ navigation, route }) {
  const { tema } = useTema();
  
  const jugador = route.params?.jugador || 'Anónimo'; 
  const categoria = route.params?.categoria || 'Aleatoria';
  const nivel = route.params?.nivel || 'Fácil';

  // NUEVO: Importamos usarPista desde el hook
  const { estado, jugarLetra, iniciarPartida, usarPista } = useJuego(categoria, nivel);

  useEffect(() => {
    if (estado.estado === 'ganado' || estado.estado === 'perdido') {
      guardarPuntaje(jugador, estado.puntaje, categoria, nivel);
    }
  }, [estado.estado, jugador, categoria, nivel, estado.puntaje]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (estado.estado !== 'jugando') return;
      e.preventDefault();
      Alert.alert(
        '¿Abandonar partida?',
        'Si sales ahora, perderás tu progreso actual.',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => {} },
          { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, estado.estado]);

  const manejarPresionLetra = (letra) => {
    const palabraLimpia = quitarTildes(estado.palabra);
    const esAcierto = palabraLimpia.includes(letra);
    
    if (esAcierto) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    jugarLetra(letra);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.contenedor, { backgroundColor: tema.fondo }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Marcador 
        puntaje={estado.puntaje} 
        errores={estado.errores} 
        tiempoRestante={estado.tiempoRestante} 
      />
      
      <Ahorcado errores={estado.errores} />

      {/* NUEVO: SECCIÓN DE PISTA */}
      <View style={styles.seccionPista}>
        {estado.mostrarTextoPista && (
          <Text style={[styles.textoPista, { color: tema.texto }]}>💡 Pista: {estado.pista}</Text>
        )}
        
        {estado.pistasDisponibles > 0 && estado.estado === 'jugando' && (
          <Pressable style={styles.botonPista} onPress={usarPista}>
            <Text style={styles.textoBotonPista}>
              Usar Pista ({estado.pistasDisponibles} disp.) -15pts
            </Text>
          </Pressable>
        )}
      </View>
      
      <PalabraOculta 
        palabra={estado.palabra} 
        letrasAcertadas={estado.letrasAcertadas} 
      />
      
      <Teclado 
        letrasAcertadas={estado.letrasAcertadas}
        letrasFalladas={estado.letrasFalladas}
        onPressLetra={manejarPresionLetra}
      />

      <ModalResultado
        visible={estado.estado !== 'jugando'}
        estadoPartida={estado.estado}
        palabra={estado.palabra}
        puntaje={estado.puntaje}
        onJugarDeNuevo={iniciarPartida}
        onMenu={() => navigation.navigate('Inicio')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 28,
    alignItems: 'center',
  },
  seccionPista: {
    alignItems: 'center',
    marginVertical: 5,
    minHeight: 40,
    width: '90%',
    justifyContent: 'center',
  },
  textoPista: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  botonPista: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  textoBotonPista: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
