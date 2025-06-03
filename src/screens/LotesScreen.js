import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import styles from '../utils/lotesStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const API = "http://192.168.0.19:3000/api/lote";
const API_MATERIAS = "http://192.168.0.19:3000/api/materia-prima"; // Ajusta la IP si cambia

export default function LotesScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [materiaPrimaSeleccionada, setMateriaPrimaSeleccionada] = useState(null);

  // Fetch lotes existentes
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

  // Fetch materias primas
  useEffect(() => {
    fetch(API_MATERIAS)
      .then(res => res.json())
      .then(data => setMateriasPrimas(data))
      .catch(err => console.error("Error al obtener materias primas:", err));
  }, []);

  // POST
  const postLote = async () => {
    const nuevoLote = {
      Nombre: nombre,
      FechaCreacion: fecha.toISOString(),
      Estado: estado,
      MateriasPrimas: materiaPrimaSeleccionada ? [materiaPrimaSeleccionada] : []
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
        setEstado('Pendiente');
        setFecha(new Date());
        setMateriaPrimaSeleccionada(null);
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

        {/* Nombre */}
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

        {/* Materia Prima */}
        <Text style={{ marginBottom: 4 }}>Seleccionar Materia Prima</Text>
        <View style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 4,
          marginBottom: 8,
        }}>
          <Picker
            selectedValue={materiaPrimaSeleccionada}
            onValueChange={(itemValue) => setMateriaPrimaSeleccionada(itemValue)}
          >
            <Picker.Item label="Seleccionar" value={null} />
            {materiasPrimas.map(mp => (
              <Picker.Item key={mp.IdMateriaPrima} label={mp.Nombre} value={mp} />
            ))}
          </Picker>
        </View>

        {/* Fecha de Creación */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 8,
          }}
        >
          <Text>Fecha: {fecha.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFecha(selectedDate);
              }
            }}
          />
        )}

        {/* Estado */}
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
                    • {mp.Nombre} ({mp.Cantidad || 0})
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
