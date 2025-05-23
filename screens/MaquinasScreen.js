import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const API = "http://192.168.0.20:3000/api/maquinas";

export default function MaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setMaquinas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener máquinas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <FlatList
      data={maquinas}
      keyExtractor={(item) => item.IdMaquina.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.Nombre}</Text>
          <Text style={styles.detail}>Descripción: {item.Descripcion || 'N/A'}</Text>
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E6F2E6',
  },
  container: {
    padding: 16,
    backgroundColor: '#E6F2E6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'transparent', // sin color de fondo
    borderWidth: 1,
    borderColor: 'black', // borde negro
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    // Sombra para Android:
    elevation: 6,
    // Sombra para iOS:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    color: '#2E8B57', // verde para el título
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  detail: {
    color: '#000', // texto negro o gris oscuro para detalles
    fontSize: 16,
    lineHeight: 22,
  },
});
