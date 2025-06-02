import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import styles from '../utils/procesosStyles';

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
    return (
      <ActivityIndicator
        size="large"
        color="#2E8B57"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
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
