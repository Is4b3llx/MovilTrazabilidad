import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Button } from 'react-native';
import styles from '../utils/lotesStyles';

const API = "http://192.168.0.20:3000/api/lote"; // Ajusta la IP si cambia

export default function LotesScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');

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

  // POST
  const postLote = async () => {
    const nuevoLote = {
      Nombre: nombre,
      FechaCreacion: new Date().toISOString(),
      Estado: estado,
      MateriasPrimas: [], // Inicialmente vacío
    };

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLote),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Lote creado:', data);
        setLotes(prev => [...prev, data]);
        // Limpiar formulario
        setNombre('');
        setEstado('');
      } else {
        console.error('Error al crear lote:', response.status);
      }
    } catch (error) {
      console.error('Error en el POST:', error);
    }
  };

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
    <>
      {/* Formulario de creación de lote */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Crear Nuevo Lote</Text>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            marginBottom: 8,
            padding: 8,
          }}
        />
        <TextInput
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            marginBottom: 8,
            padding: 8,
          }}
        />
        <Button title="Crear Lote" onPress={postLote} color="#2E8B57" />
      </View>

      {/* Lista de lotes existente */}
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
                    • {mp.Nombre} ({mp.Cantidad})
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </>
  );
}
