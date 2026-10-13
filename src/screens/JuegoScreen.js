import React, { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useJuego } from '../hooks/useJuego';
import { useTema } from '../context/TemaContext';
import { guardarPuntaje } from '../storage/almacenamiento';
import Ahorcado from '../components/Ahorcado';
import PalabraOculta from '../components/PalabraOculta';
import Teclado from '../components/Teclado';
import Marcador from '../components/Marcador';
import ModalResultado from '../components/ModalResultado';

const quitarTildes = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export default function JuegoScreen({ navigation, route }) {
  const { tema } = useTema();
  const jugador = route.params?.jugador || 'Anónimo';
  const categoria = route.params?.categoria || 'Aleatoria';
  const nivel = route.params?.nivel || 'Fácil';
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
          { text: 'Seguir jugando', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, estado.estado]);

  const manejarPresionLetra = (letra) => {
    const palabraLimpia = quitarTildes(estado.palabra);
    if (palabraLimpia.includes(letra)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    jugarLetra(letra);
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, { backgroundColor: tema.fondo }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contenido}>
          <View style={styles.encabezadoPartida}>
            <View style={styles.infoJugador}>
              <Text style={[styles.saludo, { color: tema.texto }]}>¡Vamos, {jugador}!</Text>
              <Text style={[styles.subtitulo, { color: tema.texto }]}>{categoria} · {nivel}</Text>
            </View>
            <View style={[styles.chipNivel, { backgroundColor: tema.teclaHabilitada }]}>
              <Text style={[styles.chipTexto, { color: tema.primario }]}>{nivel}</Text>
            </View>
          </View>

          <Marcador
            puntaje={estado.puntaje}
            errores={estado.errores}
            tiempoRestante={estado.tiempoRestante}
          />

          <Ahorcado errores={estado.errores} />

          <View style={[styles.tarjetaPista, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
            <View style={styles.encabezadoPista}>
              <Text style={styles.iconoPista}>✦</Text>
              <Text style={[styles.tituloPista, { color: tema.texto }]}>Pista</Text>
            </View>
            <Text style={[styles.textoPista, { color: tema.texto }]}>
              {estado.mostrarTextoPista ? estado.pista : '¿Necesitas una ayuda para descubrir la palabra?'}
            </Text>
            {estado.pistasDisponibles > 0 && estado.estado === 'jugando' && (
              <Pressable
                accessibilityRole="button"
                onPress={usarPista}
                style={({ pressed }) => [styles.botonPista, pressed && styles.botonPresionado]}
              >
                <Text style={styles.textoBotonPista}>
                  Revelar pista · {estado.pistasDisponibles} {estado.pistasDisponibles === 1 ? 'disponible' : 'disponibles'} · −15 pts
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.seccionPalabra}>
            <Text style={[styles.instruccion, { color: tema.texto }]}>Adivina la palabra</Text>
            <PalabraOculta palabra={estado.palabra} letrasAcertadas={estado.letrasAcertadas} />
          </View>

          <View style={styles.seccionTeclado}>
            <View style={styles.instruccionFila}>
              <Text style={[styles.instruccion, { color: tema.texto }]}>Elige una letra</Text>
              <Text style={[styles.contadorErrores, { color: tema.texto }]}>{estado.errores}/6 errores</Text>
            </View>
            <Teclado
              letrasAcertadas={estado.letrasAcertadas}
              letrasFalladas={estado.letrasFalladas}
              onPressLetra={manejarPresionLetra}
              bloqueado={estado.estado !== 'jugando'}
            />
          </View>
        </View>
      </ScrollView>

      <ModalResultado
        visible={estado.estado !== 'jugando'}
        estadoPartida={estado.estado}
        palabra={estado.palabra}
        puntaje={estado.puntaje}
        onJugarDeNuevo={iniciarPartida}
        onMenu={() => navigation.navigate('Categoria', { jugador })}
        onInicio={() => navigation.navigate('Inicio')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 },
  contenido: { width: '100%', maxWidth: 480, alignSelf: 'center', alignItems: 'center' },
  encabezadoPartida: { width: '90%', maxWidth: 420, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  infoJugador: { flex: 1, paddingRight: 8 },
  saludo: { fontSize: 20, fontWeight: '900' },
  subtitulo: { fontSize: 12, opacity: 0.68, marginTop: 3 },
  chipNivel: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  chipTexto: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.6 },
  tarjetaPista: { width: '90%', maxWidth: 360, padding: 15, borderWidth: 1, borderRadius: 18, marginTop: 12 },
  encabezadoPista: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  iconoPista: { color: '#FFB84D', fontSize: 18, fontWeight: '900' },
  tituloPista: { fontSize: 14, fontWeight: '900' },
  textoPista: { fontSize: 13, lineHeight: 19, opacity: 0.8 },
  botonPista: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFB84D' },
  textoBotonPista: { color: '#33210A', fontSize: 12, fontWeight: '900' },
  botonPresionado: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  seccionPalabra: { width: '100%', alignItems: 'center', marginTop: 16 },
  instruccionFila: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2, paddingHorizontal: 4 },
  instruccion: { fontSize: 15, fontWeight: '800' },
  contadorErrores: { fontSize: 11, opacity: 0.65, fontWeight: '700' },
  seccionTeclado: { width: '100%', alignItems: 'center', marginTop: 6 },
});
