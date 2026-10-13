// src/screens/EstadisticasScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { cargarEstadisticas, cargarRanking } from '../storage/almacenamiento';
import { useTema } from '../context/TemaContext';

export default function EstadisticasScreen() {
  const [estadisticas, setEstadisticas] = useState({ jugadas: 0, ganadas: 0, perdidas: 0, rachaActual: 0, mejorRacha: 0 });
  const [ranking, setRanking] = useState([]);
  
  // Hook de React Navigation para saber cuándo la pantalla entra en foco
  const isFocused = useIsFocused(); 
  const { tema } = useTema();

  useEffect(() => {
    // Recargar los datos cada vez que el usuario entre a esta pantalla
    if (isFocused) {
      const fetchData = async () => {
        const stats = await cargarEstadisticas();
        const ranks = await cargarRanking();
        setEstadisticas(stats);
        setRanking(ranks);
      };
      fetchData();
    }
  }, [isFocused]);

  // Cálculo del porcentaje de victorias
  const porcentajeVictorias = estadisticas.jugadas > 0
    ? Math.round((estadisticas.ganadas / estadisticas.jugadas) * 100)
    : 0;

  // Renderizado de cada fila del Ranking (Top 10)
  const renderItemRanking = ({ item, index }) => (
    <View style={[styles.filaRanking, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
      <Text style={[styles.posicion, { color: tema.texto }]}>#{index + 1}</Text>
      <View style={styles.infoJugador}>
        <Text style={[styles.nombre, { color: tema.texto }]}>{item.nombre}</Text>
        <Text style={[styles.detalle, { color: tema.texto }]}>{item.categoria} - {item.nivel}</Text>
      </View>
      <Text style={[styles.puntaje, { color: tema.primario }]}>{item.puntaje} pts</Text>
    </View>
  );

  return (
    <View style={[styles.contenedor, { backgroundColor: tema.fondo }]}>
      
      {/* Panel de Resumen General */}
      <View style={[styles.panelStats, { backgroundColor: tema.teclaHabilitada }]}>
        <Text style={[styles.tituloPanel, { color: tema.texto }]}>Resumen Histórico</Text>
        <View style={styles.filaStats}>
          <View style={styles.datoStat}>
            <Text style={[styles.valorStat, { color: tema.texto }]}>{estadisticas.jugadas}</Text>
            <Text style={[styles.labelStat, { color: tema.texto }]}>Jugadas</Text>
          </View>
          <View style={styles.datoStat}>
            <Text style={[styles.valorStat, { color: tema.acierto }]}>{estadisticas.ganadas}</Text>
            <Text style={[styles.labelStat, { color: tema.texto }]}>Ganadas</Text>
          </View>
          <View style={styles.datoStat}>
            <Text style={[styles.valorStat, { color: tema.primario }]}>{porcentajeVictorias}%</Text>
            <Text style={[styles.labelStat, { color: tema.texto }]}>Victoria</Text>
          </View>
          <View style={styles.datoStat}>
            <Text style={[styles.valorStat, { color: '#FF9800' }]}>{estadisticas.mejorRacha}</Text>
            <Text style={[styles.labelStat, { color: tema.texto }]}>Racha Max</Text>
          </View>
        </View>
      </View>

      {/* Lista de Ranking */}
      <Text style={[styles.tituloRanking, { color: tema.texto }]}>Top 10 Mejores Puntajes</Text>
      
      {ranking.length === 0 ? (
        <Text style={[styles.textoVacio, { color: tema.texto }]}>Aún no hay puntajes registrados. ¡Juega una partida para aparecer aquí!</Text>
      ) : (
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.id}
          renderItem={renderItemRanking}
          contentContainerStyle={styles.listaRanking}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 15 },
  panelStats: {
    padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  tituloPanel: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  filaStats: { flexDirection: 'row', justifyContent: 'space-between' },
  datoStat: { alignItems: 'center', flex: 1 },
  valorStat: { fontSize: 22, fontWeight: 'bold' },
  labelStat: { fontSize: 12, color: '#666', marginTop: 5 },
  tituloRanking: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, paddingLeft: 5 },
  textoVacio: { textAlign: 'center', fontSize: 16, color: '#999', marginTop: 30, fontStyle: 'italic' },
  listaRanking: { paddingBottom: 20 },
  filaRanking: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    borderRadius: 10, marginBottom: 10, borderWidth: 1,
  },
  posicion: { fontSize: 18, fontWeight: 'bold', color: '#999', width: 40 },
  infoJugador: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: 'bold' },
  detalle: { fontSize: 12, color: '#666', marginTop: 2 },
  puntaje: { fontSize: 18, fontWeight: 'bold' },
});
