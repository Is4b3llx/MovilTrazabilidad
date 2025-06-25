import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet
} from 'react-native';

const API = "http://10.26.13.160:3000/api/lote";

export default function LotesScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setLotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener lotes:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Encabezado */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Lotes Registrados</Text>
      </View>

      {/* Lista de lotes */}
      <FlatList
        data={lotes}
        keyExtractor={(item) => item.IdLote.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Nombre}</Text>
            <Text style={styles.detail}>
              Fecha: {new Date(item.FechaCreacion).toLocaleDateString()}
            </Text>
            <Text style={styles.detail}>Estado: {item.Estado}</Text>
            {item.MateriasPrimas && item.MateriasPrimas.length > 0 && (
              <View style={styles.subList}>
                <Text style={styles.subTitle}>Materias Primas:</Text>
                {item.MateriasPrimas.map((mp) => (
                  <Text key={mp.IdMateriaPrima} style={styles.detail}>
                    • {mp.Nombre} ({mp.Cantidad || 0})
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E6F2E6',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F2E6',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  subList: {
    marginTop: 8,
  },
  subTitle: {
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
