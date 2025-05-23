import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const API = "http://192.168.0.20:3000/api/procesos"; // Ajusta la IP si cambia

export default function ProcesosScreen() {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setProcesos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener procesos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E8B57" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <FlatList
      data={procesos}
      keyExtractor={(item) => item.IdProceso.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.Nombre}</Text>
          <Text style={styles.detail}>{item.Descripcion}</Text>
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E6F2E6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',         // fondo blanco
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,                  // borde negro
    borderColor: '#000',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',                // título verde
  },
  detail: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',                   // texto detalle gris oscuro
  },
});
