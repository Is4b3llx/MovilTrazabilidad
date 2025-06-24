import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity,
  TextInput, Modal, Alert, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../utils/materiasStyles';

const API = "http://192.168.0.20:3000/api/materia-prima";

export default function MateriasPrimasScreen() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [nombre, setNombre] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fecha, setFecha] = useState(new Date());

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
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setFecha(today);
    setFechaRecepcion(formatted);
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFecha(selectedDate);
      setFechaRecepcion(formattedDate);
    }
  };

  const handleAddMateria = async () => {
    if (!nombre || !fechaRecepcion || !cantidad) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: nombre,
          FechaRecepcion: fechaRecepcion,
          Proveedor: proveedor,
          Cantidad: parseFloat(cantidad),
        }),
      });
      if (response.ok) {
        Alert.alert("Éxito", "Materia prima creada correctamente");
        setModalVisible(false);
        resetForm();
        fetchMaterias();
      } else {
        Alert.alert("Error", "No se pudo crear la materia prima");
      }
    } catch (error) {
      Alert.alert("Error", "Error al crear materia prima");
      console.error(error);
    }
  };

  const resetForm = () => {
    setNombre('');
    setProveedor('');
    setCantidad('');
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setFecha(today);
    setFechaRecepcion(formatted);
  };

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

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nueva Materia Prima</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre de la materia prima"
            />

            <Text style={styles.label}>Fecha de Recepción *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{fechaRecepcion || "Seleccionar fecha"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Proveedor</Text>
            <TextInput
              style={styles.input}
              value={proveedor}
              onChangeText={setProveedor}
              placeholder="Nombre del proveedor"
            />

            <Text style={styles.label}>Cantidad *</Text>
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="Cantidad"
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddMateria}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
