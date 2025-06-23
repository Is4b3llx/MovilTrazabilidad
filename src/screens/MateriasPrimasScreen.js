import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../utils/materiasStyles';

const API = "http://192.168.0.20:3000/api/materia-prima";

export default function MateriasPrimasScreen({ navigation }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados para formulario
  const [nombre, setNombre] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Date Picker
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón */}
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

      {/* Modal para el formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Nueva Materia Prima</Text>

            <Text style={modalStyles.label}>Nombre *</Text>
            <TextInput
              style={modalStyles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre de la materia prima"
            />

            <Text style={modalStyles.label}>Fecha de Recepción *</Text>
            <TouchableOpacity
              style={modalStyles.input}
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

            <Text style={modalStyles.label}>Proveedor</Text>
            <TextInput
              style={modalStyles.input}
              value={proveedor}
              onChangeText={setProveedor}
              placeholder="Nombre del proveedor"
            />

            <Text style={modalStyles.label}>Cantidad *</Text>
            <TextInput
              style={modalStyles.input}
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="Cantidad"
              keyboardType="numeric"
            />

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, modalStyles.saveButton]}
                onPress={handleAddMateria}
              >
                <Text style={modalStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Listado de materias primas */}
      <FlatList
        data={materias}
        keyExtractor={(item) => item.IdMateriaPrima.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
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
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
            No hay materias primas registradas
          </Text>
        }
      />
    </View>
  );
}

// Estilos específicos para el modal
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E8B57',
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
