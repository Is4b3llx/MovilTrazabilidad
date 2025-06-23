import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TextInput,
  TouchableOpacity, Platform, Modal
} from 'react-native';
import styles from '../utils/lotesStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

const API = "http://192.168.0.20:3000/api/lote";
const API_MATERIAS = "http://192.168.0.20:3000/api/materia-prima";

export default function LotesScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [materiaPrimaSeleccionada, setMateriaPrimaSeleccionada] = useState(null);

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

  useEffect(() => {
    fetch(API_MATERIAS)
      .then(res => res.json())
      .then(data => setMateriasPrimas(data))
      .catch(err => console.error("Error al obtener materias primas:", err));
  }, []);

  const resetForm = () => {
    setNombre('');
    setEstado('Pendiente');
    setFecha(new Date());
    setMateriaPrimaSeleccionada(null);
  };

  const postLote = async () => {
    if (!nombre || !estado) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

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
        setLotes(prev => [...prev, data]);
        setModalVisible(false);
        resetForm();
      } else {
        console.error('Error al crear lote:', response.status);
      }
    } catch (error) {
      console.error('Error en el POST:', error);
    }
  };

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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para crear lote */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Lote</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del lote"
            />

            <Text style={styles.label}>Materia Prima</Text>
            <View style={styles.input}>
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

            <Text style={styles.label}>Fecha *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{fecha.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setFecha(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={styles.input}
              value={estado}
              onChangeText={setEstado}
              placeholder="Estado del lote"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={postLote}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
