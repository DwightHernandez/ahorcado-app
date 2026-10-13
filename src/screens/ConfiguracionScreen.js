// src/screens/ConfiguracionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Pressable, Alert } from 'react-native';
import { cargarConfiguracion, guardarConfiguracion, borrarDatosLocales } from '../storage/almacenamiento';
import { useTema } from '../context/TemaContext';

export default function ConfiguracionScreen() {
  const [config, setConfig] = useState({ sonido: true, vibracion: true, tema: 'claro' });
  const { tema, setModoOscuro } = useTema();

  // Cargar las preferencias guardadas al abrir la pantalla
  useEffect(() => {
    const cargar = async () => {
      const confGuardada = await cargarConfiguracion();
      const configCompleta = { sonido: true, vibracion: true, tema: 'claro', ...confGuardada };
      setConfig(configCompleta);
      setModoOscuro(configCompleta.tema === 'oscuro');
    };
    cargar();
  }, []);

  // Manejador para los interruptores
  const toggleSwitch = async (clave) => {
    const nuevaConfig = clave === 'tema'
      ? { ...config, tema: config.tema === 'oscuro' ? 'claro' : 'oscuro' }
      : { ...config, [clave]: !config[clave] };
    setConfig(nuevaConfig);
    if (clave === 'tema') setModoOscuro(nuevaConfig.tema === 'oscuro');
    await guardarConfiguracion(nuevaConfig);
  };

  // Confirmación de borrado (RF-14)
  const confirmarBorrado = () => {
    Alert.alert(
      'Borrar Estadísticas',
      '¿Estás seguro de que deseas eliminar todo tu historial y puntajes? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, borrar', 
          style: 'destructive', 
          onPress: async () => {
            const exito = await borrarDatosLocales();
            if (exito) {
              Alert.alert('Éxito', 'Las estadísticas y el ranking han sido borrados.');
            }
          } 
        },
      ]
    );
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: tema.fondo }]}>
      <Text style={[styles.titulo, { color: tema.texto }]}>Ajustes del Juego</Text>

      <View style={[styles.seccion, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
        <View style={styles.filaOpcion}>
          <Text style={[styles.textoOpcion, { color: tema.texto }]}>Sonido</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={config.sonido ? tema.primario : '#f4f3f4'}
            onValueChange={() => toggleSwitch('sonido')}
            value={config.sonido}
          />
        </View>

        <View style={styles.filaOpcion}>
          <Text style={[styles.textoOpcion, { color: tema.texto }]}>Vibración</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={config.vibracion ? tema.primario : '#f4f3f4'}
            onValueChange={() => toggleSwitch('vibracion')}
            value={config.vibracion}
          />
        </View>

        <View style={[styles.filaOpcion, { borderBottomWidth: 0 }]}>
          <Text style={[styles.textoOpcion, { color: tema.texto }]}>Modo Oscuro</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={config.tema === 'oscuro' ? tema.primario : '#f4f3f4'}
            onValueChange={() => toggleSwitch('tema')}
            value={config.tema === 'oscuro'}
          />
        </View>
      </View>

      <Pressable style={styles.botonBorrar} onPress={confirmarBorrado}>
        <Text style={styles.textoBorrar}>🗑️ Borrar Historial y Estadísticas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 10 },
  seccion: { borderRadius: 10, padding: 15, marginBottom: 30, elevation: 1, borderWidth: 1 },
  filaOpcion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#888' },
  textoOpcion: { fontSize: 18, fontWeight: '500' },
  botonBorrar: { backgroundColor: '#FF5252', padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
  textoBorrar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
