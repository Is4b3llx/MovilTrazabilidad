import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl 
} from 'react-native';

const API = "http://10.26.13.160:3000/api/materia-prima";

export default function MateriasPrimasScreen() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMaterias = () => {
    setRefreshing(true);
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setMaterias(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error("Error al obtener materias primas:", err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Materias Primas Registradas</Text>
        </View>
      </View>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.IdMateriaPrima.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Nombre}</Text>
            <Text style={styles.detail}>Cantidad: {item.Cantidad} {item.Unidad}</Text>
            {item.Proveedor && <Text style={styles.detail}>Proveedor: {item.Proveedor}</Text>}
            {item.Descripcion && <Text style={styles.detail}>Descripción: {item.Descripcion}</Text>}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={fetchMaterias}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay materias primas registradas
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E6F2E6',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
