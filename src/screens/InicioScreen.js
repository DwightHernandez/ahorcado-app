import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTema } from "../context/TemaContext";
import TituloAhorcado from "../components/TituloAhorcado";

export default function InicioScreen({ navigation }) {
  const [jugador, setJugador] = useState("");
  const { tema } = useTema();

  const irASeleccion = () => {
    const nombre = jugador.trim();
    if (!nombre) return;

    navigation.navigate("Categoria", {
      jugador: nombre,
    });
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: tema.fondo }]}>
      <TituloAhorcado />
      <Text style={[styles.subtitulo, { color: tema.texto }]}>
        Edición Colombia
      </Text>
      <Text style={[styles.descripcion, { color: tema.texto }]}>
        Pon a prueba tus conocimientos y adivina la palabra.
      </Text>

      <Text style={[styles.etiquetaNombre, { color: tema.texto }]}>
        Nombre del jugador (obligatorio)
      </Text>
      <TextInput
        value={jugador}
        onChangeText={setJugador}
        placeholder="Tu nombre"
        placeholderTextColor="#888"
        maxLength={24}
        returnKeyType="go"
        onSubmitEditing={irASeleccion}
        accessibilityLabel="Nombre del jugador, obligatorio"
        style={[styles.entrada, { borderColor: tema.borde, color: tema.texto }]}
      />

      <Pressable
        accessibilityRole="button"
        disabled={!jugador.trim()}
        style={[
          styles.botonJugar,
          { backgroundColor: jugador.trim() ? tema.primario : "#9E9E9E" },
        ]}
        onPress={irASeleccion}
      >
        <Text style={styles.textoBoton}>Empezar</Text>
      </Pressable>

      <Pressable
        style={styles.botonSecundario}
        onPress={() => navigation.navigate("Estadisticas")}
      >
        <Text style={[styles.textoSecundario, { color: tema.primario }]}>
          Estadísticas
        </Text>
      </Pressable>
      <Pressable
        style={styles.botonSecundario}
        onPress={() => navigation.navigate("Configuracion")}
      >
        <Text style={[styles.textoSecundario, { color: tema.primario }]}>
          Configuración
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  titulo: { fontSize: 38, fontWeight: "800", marginBottom: 12 },
  descripcion: { fontSize: 17, textAlign: "center", marginBottom: 28 },
  etiquetaNombre: {
    width: "100%",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  entrada: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    marginBottom: 14,
  },
  botonJugar: {
    width: "100%",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  textoBoton: { color: "#fff", fontSize: 18, fontWeight: "700" },
  botonSecundario: { padding: 12 },
  textoSecundario: { fontSize: 16, fontWeight: "600" },
});
