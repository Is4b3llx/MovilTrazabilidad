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
      console.log('Máquinas cargadas:', data);
      console.log('Estructura de la primera máquina:', data[0] ? Object.keys(data[0]) : 'No hay máquinas');
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
    
    console.log('Agregando máquina:', maquina);
    console.log('Campos de la máquina:', Object.keys(maquina));
    
    // Validar que la máquina tenga todos los campos requeridos
    if (!maquina.Nombre || !maquina.ImagenUrl) {
      console.error('Máquina con campos faltantes:', maquina);
      Alert.alert("Error", "La máquina no tiene todos los campos requeridos");
      return;
    }
    
    const nuevaMaquina = { 
      IdMaquina: maquina.IdMaquina,
      Nombre: maquina.Nombre,
      Imagen: maquina.ImagenUrl,
      variables: [{ 
        nombre: "", 
        min: "0", 
        max: "100"
      }]
    };
    
    console.log('Nueva máquina creada:', nuevaMaquina);
    
    setMaquinasSeleccionadas([
      ...maquinasSeleccionadas,
      nuevaMaquina
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
    nuevasMaquinas[indexMaquina].variables.push({ 
      nombre: "", 
      min: "0", 
      max: "100"  // Cambio de "0" a "100" para valores más realistas
    });
    setMaquinasSeleccionadas(nuevasMaquinas);
  };

  const actualizarVariable = (indexMaquina, indexVariable, campo, valor) => {
    const nuevasMaquinas = [...maquinasSeleccionadas];
    nuevasMaquinas[indexMaquina].variables[indexVariable][campo] = valor;
    setMaquinasSeleccionadas(nuevasMaquinas);
  };

  const eliminarVariable = (indexMaquina, indexVariable) => {
    const nuevasMaquinas = [...maquinasSeleccionadas];
    if (nuevasMaquinas[indexMaquina].variables.length > 1) {
      nuevasMaquinas[indexMaquina].variables.splice(indexVariable, 1);
      setMaquinasSeleccionadas(nuevasMaquinas);
    } else {
      Alert.alert("Error", "Cada máquina debe tener al menos una variable");
    }
  };

  const guardarProceso = async () => {
    // Validaciones básicas
    if (!nombreProceso.trim()) {
      setError('Debes ingresar un nombre para el proceso');
      return;
    }
    
    if (maquinasSeleccionadas.length === 0) {
      setError('Debes agregar al menos una máquina');
      return;
    }

    // Validar máquinas y variables
    for (const maquina of maquinasSeleccionadas) {
      // Verificar que la máquina existe en las máquinas disponibles
      const maquinaExiste = maquinasDisponibles.some(m => m.Nombre === maquina.Nombre);
      if (!maquinaExiste) {
        setError(`La máquina "${maquina.Nombre}" no existe en la base de datos`);
        return;
      }

      // Verificar que la máquina tenga imagen
      if (!maquina.Imagen || !maquina.Imagen.trim()) {
        setError(`La máquina "${maquina.Nombre}" no tiene imagen`);
        return;
      }

      if (!maquina.variables || maquina.variables.length === 0) {
        setError(`La máquina "${maquina.Nombre}" no tiene variables`);
        return;
      }
      
      for (const variable of maquina.variables) {
        if (!variable.nombre || !variable.nombre.trim()) {
          setError(`La máquina "${maquina.Nombre}" tiene variables sin nombre`);
          return;
        }
        
        const min = parseFloat(variable.min);
        const max = parseFloat(variable.max);
        
        if (isNaN(min) || isNaN(max)) {
          setError(`Los valores de la variable "${variable.nombre}" deben ser números válidos`);
          return;
        }
        
        if (min > max) {
          setError(`En la variable "${variable.nombre}": el mínimo no puede ser mayor que el máximo`);
          return;
        }
      }
    }

    // Crear payload
    const payload = {
      nombre: nombreProceso.trim(),
      maquinas: maquinasSeleccionadas.map((maquina, index) => {
        // Validar que todos los campos estén presentes
        if (!maquina.Nombre || !maquina.Imagen) {
          console.error('Máquina con campos faltantes:', maquina);
          throw new Error(`Máquina ${index + 1} tiene campos faltantes`);
        }

        const maquinaPayload = {
          numero: index + 1,
          nombre: maquina.Nombre,
          imagen: maquina.Imagen,
          variables: maquina.variables.map(variable => ({
            nombre: variable.nombre.trim(),
            min: parseFloat(variable.min),
            max: parseFloat(variable.max)
          }))
        };

        // Validar que el payload de la máquina esté completo
        if (!maquinaPayload.numero || !maquinaPayload.nombre || !maquinaPayload.imagen || !maquinaPayload.variables) {
          console.error('Payload de máquina incompleto:', maquinaPayload);
          throw new Error(`Payload de máquina ${index + 1} incompleto`);
        }

        return maquinaPayload;
      })
    };

    console.log('Enviando payload:', JSON.stringify(payload, null, 2));
    console.log('Estructura del payload:');
    console.log('- nombre:', payload.nombre);
    console.log('- número de máquinas:', payload.maquinas.length);
    payload.maquinas.forEach((maquina, index) => {
      console.log(`- Máquina ${index + 1}:`, {
        numero: maquina.numero,
        nombre: maquina.nombre,
        imagen: maquina.imagen,
        variables: maquina.variables.length
      });
      console.log(`  - Variables:`, maquina.variables);
    });

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Respuesta exitosa:', result);

      Alert.alert('Éxito', 'Proceso creado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setCreandoProceso(false);
            setNombreProceso('');
            setMaquinasSeleccionadas([]);
            setError(null);
            fetchProcesos();
          }
        }
      ]);

    } catch (error) {
      console.error('Error completo al guardar:', error);
      setError(`Error al guardar el proceso: ${error.message}`);
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
                source={{ uri: maquina.ImagenUrl }} 
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
                    {maquina.variables.length > 1 && (
                      <TouchableOpacity
                        style={styles.deleteVariableButton}
                        onPress={() => eliminarVariable(indexMaquina, indexVariable)}
                      >
                        <Text style={styles.deleteVariableText}>❌</Text>
                      </TouchableOpacity>
                    )}
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
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  maquinaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMaquinaImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  maquinaInfo: {
    flex: 1,
  },
  maquinaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
    color: '#ef476f',
  },
  variablesTitle: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  variableRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  variableInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteVariableButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteVariableText: {
    fontSize: 16,
    color: '#ef476f',
  },
  addVariableButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  addVariableText: {
    color: '#2E8B57',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ef476f',
  },
  saveButton: {
    backgroundColor: '#2E8B57',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

const detailStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 4,
    textAlign: 'center',
  },
  procesoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  procesoId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  maquinasContainer: {
    marginTop: 10,
  },
  maquinaCard: {
    backgroundColor: '#e6f2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  maquinaImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  maquinaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 6,
  },
  variablesContainer: {
    marginTop: 6,
    paddingLeft: 12,
  },
  variableText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: '#ef476f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
