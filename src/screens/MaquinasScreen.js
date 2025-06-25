import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utils/maquinasStyles';

const API = "http://10.26.13.160:3000/api/maquinas";
const API_MAQUINAS_ASIGNADAS = "http://10.26.13.160:3000/api/operadores";

export default function MaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [maquinasAsignadas, setMaquinasAsignadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resMaquinas = await fetch(API);
      const dataMaquinas = await resMaquinas.json();
      setMaquinas(dataMaquinas);
      const operadorId = await AsyncStorage.getItem('operadorId');
      if (operadorId) {
        const resAsignadas = await fetch(`${API_MAQUINAS_ASIGNADAS}/${operadorId}/maquinas`);
        const dataAsignadas = await resAsignadas.json();
        setMaquinasAsignadas(dataAsignadas.map(m => m.IdMaquina));
      } else {
        setMaquinasAsignadas([]);
      }
    } catch (error) {
      setMaquinas([]);
      setMaquinasAsignadas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={maquinas}
        keyExtractor={(item) => item.IdMaquina.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Gestión de Máquinas</Text>
            <Text style={styles.subtitulo}>Todas las máquinas</Text>
            {loading && <ActivityIndicator color="#007c64" />}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.maquinaCard}>
            <Image
              source={{ uri: item.ImagenUrl }}
              style={styles.maquinaImage}
              resizeMode="contain"
            />
            <Text style={[
              styles.maquinaNombre,
              maquinasAsignadas.includes(item.IdMaquina) && { color: 'red', fontWeight: 'bold' }
            ]}>
              {item.Nombre}
            </Text>
          </View>
        )}
      />
    </View>
  );
}