import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import styles from '../utils/procesosStyles';

const API = "http://192.168.0.19:3000/api/procesos"; // Ajusta la IP si cambia

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
          
          {/* Botones añadidos */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#2E8B57' }]}
              onPress={() => console.log('Ver detalle', item.IdProceso)}
            >
              <Text style={styles.buttonText}>Ver detalle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#3A86FF', marginLeft: 10 }]}
              onPress={() => console.log('Descargar PDF', item.IdProceso)}
            >
              <Text style={styles.buttonText}>Descargar PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}