import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Image, StyleSheet, RefreshControl, TextInput, Alert } from 'react-native';

const API = "http://192.168.0.20:3000/api/procesos";
const API_MAQUINAS = "http://192.168.0.20:3000/api/maquinas";

export default function ProcesoScreen({ navigation }) {
  // Estados para la lista de procesos
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Estados para creación de procesos
  const [creandoProceso, setCreandoProceso] = useState(false);
  const [nombreProceso, setNombreProceso] = useState("");
  const [maquinasDisponibles, setMaquinasDisponibles] = useState([]);
  const [maquinasSeleccionadas, setMaquinasSeleccionadas] = useState([]);

  // Cargar procesos y máquinas
  useEffect(() => {
    fetchProcesos();
    fetchMaquinas();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProcesos();
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchProcesos = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setProcesos(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener procesos:", err);
      setError("No se pudieron cargar los procesos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMaquinas = async () => {
    try {
      const response = await fetch(API_MAQUINAS);
      const data = await response.json();
      setMaquinasDisponibles(data);
    } catch (err) {
      console.error("Error al obtener máquinas:", err);
      Alert.alert("Error", "No se pudieron cargar las máquinas disponibles");
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/${id}`);
      const data = await response.json();
      setSelectedProceso(data);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      setError("No se pudo cargar el detalle");
    } finally {
      setLoading(false);
    }
  };

  // Funciones para creación de procesos
  const agregarMaquina = (maquina) => {
    if (maquinasSeleccionadas.some(m => m.IdMaquina === maquina.IdMaquina)) {
      Alert.alert("Máquina ya agregada", "Esta máquina ya está en el proceso");
      return;
    }
    
    setMaquinasSeleccionadas([
      ...maquinasSeleccionadas,
      { 
        IdMaquina: maquina.IdMaquina,
        Nombre: maquina.Nombre,
        Imagen: maquina.Imagen,
        variables: [] 
      },
    ]);
  };

  const eliminarMaquina = (index) => {
    Alert.alert(
      "Eliminar máquina",
      "¿Estás seguro de eliminar esta máquina del proceso?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: () => {
            setMaquinasSeleccionadas(maquinasSeleccionadas.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  const agregarVariable = (indexMaquina) => {
    const nuevasMaquinas = [...maquinasSeleccionadas];
    nuevasMaquinas[indexMaquina].variables.push({ nombre: "", min: "0", max: "0" });
    setMaquinasSeleccionadas(nuevasMaquinas);
  };

  const actualizarVariable = (indexMaquina, indexVariable, campo, valor) => {
    const nuevasMaquinas = [...maquinasSeleccionadas];
    nuevasMaquinas[indexMaquina].variables[indexVariable][campo] = valor;
    setMaquinasSeleccionadas(nuevasMaquinas);
  };

  const validarProceso = () => {
    if (!nombreProceso.trim()) {
      setError("Debes ingresar un nombre para el proceso");
      return false;
    }

    if (maquinasSeleccionadas.length === 0) {
      setError("Debes seleccionar al menos una máquina");
      return false;
    }

    for (const maquina of maquinasSeleccionadas) {
      if (maquina.variables.length === 0) {
        setError(`La máquina ${maquina.Nombre} no tiene variables`);
        return false;
      }

      for (const variable of maquina.variables) {
        if (!variable.nombre.trim()) {
          setError("Todas las variables deben tener nombre");
          return false;
        }

        const min = parseFloat(variable.min);
        const max = parseFloat(variable.max);
        
        if (isNaN(min) || isNaN(max)) {
          setError("Los valores deben ser números");
          return false;
        }

        if (min > max) {
          setError("El mínimo no puede ser mayor que el máximo");
          return false;
        }
      }
    }

    setError(null);
    return true;
  };

  const guardarProceso = async () => {
    if (!validarProceso()) return;
    
    try {
      setLoading(true);
      
      const payload = {
        nombre: nombreProceso.trim(),
        maquinas: maquinasSeleccionadas.map((maquina, index) => ({
          IdMaquina: maquina.IdMaquina,
          numero: index + 1,
          nombre: maquina.Nombre,
          imagen: maquina.Imagen,
          variables: maquina.variables.map(variable => ({
            nombre: variable.nombre.trim(),
            min: parseFloat(variable.min),
            max: parseFloat(variable.max)
          }))
        }))
      };

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar");

      Alert.alert("Éxito", "Proceso creado correctamente", [
        { text: "OK", onPress: () => {
          setCreandoProceso(false);
          setNombreProceso("");
          setMaquinasSeleccionadas([]);
          fetchProcesos();
        }}
      ]);
      
    } catch (error) {
      console.error("Error al guardar:", error);
      setError(error.message || "Error al guardar el proceso");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  if (error && !creandoProceso) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProcesos}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (creandoProceso) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Crear Nuevo Proceso</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Proceso</Text>
          <TextInput
            style={styles.input}
            value={nombreProceso}
            onChangeText={setNombreProceso}
            placeholder="Ej: Proceso de molienda"
          />
        </View>

        <Text style={styles.sectionTitle}>Máquinas Disponibles</Text>
        <View style={styles.maquinasContainer}>
          {maquinasDisponibles.map(maquina => (
            <TouchableOpacity 
              key={maquina.IdMaquina} 
              style={styles.maquinaCard}
              onPress={() => agregarMaquina(maquina)}
            >
              <Image 
                source={{ uri: maquina.Imagen }} 
                style={styles.maquinaImage}
                resizeMode="contain"
              />
              <Text style={styles.maquinaName}>{maquina.Nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {maquinasSeleccionadas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Máquinas Seleccionadas</Text>
            {maquinasSeleccionadas.map((maquina, indexMaquina) => (
              <View key={indexMaquina} style={styles.selectedMaquina}>
                <View style={styles.maquinaHeader}>
                  <Image 
                    source={{ uri: maquina.Imagen }} 
                    style={styles.selectedMaquinaImage}
                  />
                  <View style={styles.maquinaInfo}>
                    <Text style={styles.maquinaTitle}>{maquina.Nombre}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => eliminarMaquina(indexMaquina)}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.variablesTitle}>Variables:</Text>
                {maquina.variables.map((variable, indexVariable) => (
                  <View key={indexVariable} style={styles.variableRow}>
                    <TextInput
                      style={[styles.variableInput, { flex: 2 }]}
                      value={variable.nombre}
                      onChangeText={(text) => actualizarVariable(indexMaquina, indexVariable, 'nombre', text)}
                      placeholder="Nombre"
                    />
                    <TextInput
                      style={[styles.variableInput, { flex: 1 }]}
                      value={variable.min}
                      onChangeText={(text) => actualizarVariable(indexMaquina, indexVariable, 'min', text)}
                      placeholder="Mín"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.variableInput, { flex: 1 }]}
                      value={variable.max}
                      onChangeText={(text) => actualizarVariable(indexMaquina, indexVariable, 'max', text)}
                      placeholder="Máx"
                      keyboardType="numeric"
                    />
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addVariableButton}
                  onPress={() => agregarVariable(indexMaquina)}
                >
                  <Text style={styles.addVariableText}>➕ Agregar Variable</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setCreandoProceso(false);
              setNombreProceso("");
              setMaquinasSeleccionadas([]);
              setError(null);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={guardarProceso}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Guardando...' : 'Guardar Proceso'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => setCreandoProceso(true)}
      >
        <Text style={styles.crearButtonText}>➕ Crear Proceso</Text>
      </TouchableOpacity>

      <FlatList
        data={procesos}
        keyExtractor={(item) => item.IdProceso.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProcesos();
            }}
            colors={['#2E8B57']}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Nombre}</Text>
            <Text style={styles.detail}>{item.Descripcion}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.detailButton]}
                onPress={() => handleVerDetalle(item.IdProceso)}
              >
                <Text style={styles.buttonText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay procesos registrados</Text>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={detailStyles.modalContainer}>
          {selectedProceso && (
            <>
              <View style={detailStyles.header}>
                <Text style={detailStyles.headerTitle}>Proceso de Transformación</Text>
                <Text style={detailStyles.procesoTitle}>{selectedProceso.Nombre}</Text>
                <Text style={detailStyles.procesoId}>ID: {selectedProceso.IdProceso}</Text>
              </View>

              <View style={detailStyles.maquinasContainer}>
                {selectedProceso.Maquinas?.map((maquina) => (
                  <View key={maquina.IdMaquina} style={detailStyles.maquinaCard}>
                    <Image 
                      source={{ uri: maquina.Imagen }} 
                      style={detailStyles.maquinaImage} 
                      resizeMode="contain"
                    />
                    <Text style={detailStyles.maquinaTitle}>
                      #{maquina.Numero} – {maquina.Nombre}
                    </Text>
                    <View style={detailStyles.variablesContainer}>
                      {maquina.variables?.map((variable, index) => (
                        <Text key={index} style={detailStyles.variableText}>
                          • {variable.nombre} ({variable.min} – {variable.max})
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity 
            style={detailStyles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={detailStyles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef476f',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2E8B57',
    padding: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  crearButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  crearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#2E8B57',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  // Estilos para creación de procesos
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  maquinasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  maquinaCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maquinaImage: {
    width: '100%',
    height: 80,
    marginBottom: 8,
  },
  maquinaName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedMaquina: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maquinaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedMaquinaImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  maquinaInfo: {
    flex: 1,
  },
  maquinaTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
    color: '#ef476f',
  },
  variablesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  variableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  variableInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  addVariableButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  addVariableText: {
    color: '#3A86FF',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ef476f',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#2E8B57',
    flex: 1,
    marginLeft: 8,
  },
});

const detailStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 5,
  },
  procesoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  procesoId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  maquinasContainer: {
    marginBottom: 20,
  },
  maquinaCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maquinaImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  maquinaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  variablesContainer: {
    marginLeft: 10,
  },
  variableText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});