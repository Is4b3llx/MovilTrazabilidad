import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import styles from '../utils/maquinasStyles';

const API = "http://192.168.0.19:3000/api/maquinas";

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
          {item.ImagenUrl ? (
            <Image
              source={{ uri: item.ImagenUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.noImageText}>Imagen no disponible</Text>
          )}
          <Text style={styles.title}>{item.Nombre}</Text>
          <Text style={styles.detail}>Descripción: {item.Descripcion || 'N/A'}</Text>
        </View>
      )}
    />
  );
}
