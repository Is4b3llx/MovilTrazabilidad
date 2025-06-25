import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, Alert, Modal, TextInput, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Endpoints API
const API_BASE = "http://10.26.13.160:3000/api";
const API_LOTES = `${API_BASE}/lote`;
const API_PROCESO = `${API_BASE}/proceso-transformacion`;

// Función para obtener el token de autenticación
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

// Función para obtener el estado de un formulario (como en la web)
const obtenerEstadoFormulario = async (idLote, numeroMaquina) => {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_PROCESO}/${idLote}/maquina/${numeroMaquina}`, {
      headers,
    });
    
    if (response.status === 404) {
      return null; // No completado
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener formulario de máquina ${numeroMaquina}:`, error.message);
    return null;
  }
};

export default function CertificarLoteScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [loteDetalle, setLoteDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [maquinas, setMaquinas] = useState([]);
  const [formularios, setFormularios] = useState({});
  const [showFormulario, setShowFormulario] = useState(false);
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null);
  const [variablesIngresadas, setVariablesIngresadas] = useState({});
  const [loadingCertificacion, setLoadingCertificacion] = useState(false);
  const [errores, setErrores] = useState({});
  const navigation = useNavigation();

  // Función para obtener lotes con manejo de errores mejorado
  const obtenerLotesPendientes = async () => {
    try {
      const response = await fetch(API_LOTES);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      const pendientes = data.filter(lote => lote.Estado === "Pendiente");
      return pendientes;
    } catch (error) {
      console.error("Error en obtenerLotesPendientes:", error);
      throw error;
    }
  };

  // Cargar datos con manejo de estados
  const cargarDatos = async () => {
    try {
      const lotesPendientes = await obtenerLotesPendientes();
      setLotes(lotesPendientes);
      setError(null);
      // Limpiar lote seleccionado al recargar
      setSelectedLote(null);
      setLoteDetalle(null);
      setMaquinas([]);
      setFormularios({});
    } catch (err) {
      setError("No se pudieron cargar los lotes. Por favor, intente más tarde.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para recargar
  const handleRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  // Función para cargar detalle del lote y máquinas (como en la web)
  const cargarDetalleLote = async (idLote) => {
    try {
      setLoadingDetalle(true);
      
      // Obtener el token de autenticación
      const token = await getAuthToken();
      
      // Preparar headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Obtener información básica del lote
      const loteResponse = await fetch(`${API_LOTES}/${idLote}`, {
        headers,
      });
      
      if (!loteResponse.ok) {
        if (loteResponse.status === 401) {
          throw new Error("No tienes permisos para ver este lote. Inicia sesión nuevamente.");
        }
        throw new Error(`Error HTTP: ${loteResponse.status}`);
      }

      const loteData = await loteResponse.json();
      setLoteDetalle(loteData);
      
      // Si el lote tiene proceso asignado, cargar máquinas
      if (loteData.IdProceso) {
        // Obtener el proceso de transformación del lote
        const procesoResponse = await fetch(`${API_PROCESO}/lote/${idLote}`, {
          headers,
        });
        
        if (!procesoResponse.ok) {
          if (procesoResponse.status === 401) {
            throw new Error("No tienes permisos para ver el proceso. Inicia sesión nuevamente.");
          }
          throw new Error(`Error HTTP: ${procesoResponse.status}`);
        }

        const procesoData = await procesoResponse.json();
        setMaquinas(procesoData);
        
        // Verificar estado de formularios para cada máquina
        const completados = {};
        for (const maquina of procesoData) {
          const form = await obtenerEstadoFormulario(idLote, maquina.Numero);
          completados[maquina.Numero] = !!form;
        }
        setFormularios(completados);
      }
      
    } catch (error) {
      console.error("Error al cargar detalle del lote:", error);
      setError(error.message || "No se pudo cargar el detalle del lote");
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Seleccionar lote y cargar detalle
  const handleSeleccionarLote = (idLote) => {
    setSelectedLote(idLote);
    cargarDetalleLote(idLote);
  };

  // Volver a la lista de lotes
  const handleVolverALista = () => {
    setSelectedLote(null);
    setLoteDetalle(null);
    setMaquinas([]);
    setFormularios({});
  };

  // Certificar una máquina específica
  const handleCertificarMaquina = (numeroMaquina) => {
    const maquina = maquinas.find(m => m.Numero === numeroMaquina);
    if (maquina) {
      setMaquinaSeleccionada(maquina);
      setVariablesIngresadas({});
      setErrores({});
      
      // Inicializar valores vacíos
      const iniciales = {};
      for (let v of maquina.Variables) {
        iniciales[v.Nombre] = "";
      }
      setVariablesIngresadas(iniciales);
      setShowFormulario(true);
    }
  };

  // Cerrar formulario
  const handleCerrarFormulario = () => {
    setShowFormulario(false);
    setMaquinaSeleccionada(null);
    setVariablesIngresadas({});
    setErrores({});
  };

  // Actualizar variable ingresada (como en la web)
  const handleActualizarVariable = (nombreVariable, valor) => {
    // Guardar siempre como string
    setVariablesIngresadas({ ...variablesIngresadas, [nombreVariable]: valor });

    // Validar solo si el valor no está vacío y es un número válido
    const regla = maquinaSeleccionada.Variables.find((v) => v.Nombre === nombreVariable);
    const num = parseFloat(valor);
    const fueraDeRango =
      valor !== "" &&
      (!/^-?\d*\.?\d*$/.test(valor) || isNaN(num) || num < regla.ValorMin || num > regla.ValorMax);

    setErrores({ ...errores, [nombreVariable]: fueraDeRango });
  };

  // Enviar formulario de certificación
  const handleEnviarFormulario = async () => {
    if (!maquinaSeleccionada || !selectedLote) return;

    // Validar que todas las variables estén ingresadas
    const variablesFaltantes = maquinaSeleccionada.Variables.filter(
      variable => variablesIngresadas[variable.Nombre] === undefined || variablesIngresadas[variable.Nombre] === ""
    );

    if (variablesFaltantes.length > 0) {
      Alert.alert(
        "Variables faltantes",
        `Debes ingresar todas las variables: ${variablesFaltantes.map(v => v.Nombre).join(', ')}`
      );
      return;
    }

    // Validar que no haya errores
    if (Object.values(errores).some(error => error)) {
      Alert.alert(
        "Valores incorrectos",
        "Algunos valores están fuera del rango permitido."
      );
      return;
    }

    try {
      setLoadingCertificacion(true);
      
      // Obtener el token de autenticación
      const token = await getAuthToken();
      
      // Preparar headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Enviando certificación:', {
        lote: selectedLote,
        maquina: maquinaSeleccionada.Numero,
        variables: variablesIngresadas
      });
      
      const response = await fetch(
        `${API_PROCESO}/${selectedLote}/maquina/${maquinaSeleccionada.Numero}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(variablesIngresadas),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No tienes permisos para certificar esta máquina. Inicia sesión nuevamente.");
        }
        if (response.status === 403) {
          throw new Error("No tienes permisos para registrar variables de esta máquina.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al certificar máquina');
      }

      const result = await response.json();
      
      console.log('Respuesta de certificación:', result);
      
      Alert.alert(
        "Certificación completada",
        `${result.message} ${result.cumple ? '✅' : '❌ No cumple estándares'}`,
        [
          {
            text: "OK",
            onPress: () => {
              handleCerrarFormulario();
              // Recargar el detalle del lote para ver actualizaciones
              cargarDetalleLote(selectedLote);
            }
          }
        ]
      );

    } catch (error) {
      console.error("Error al certificar máquina:", error);
      Alert.alert("Error", error.message || "Error al certificar la máquina");
    } finally {
      setLoadingCertificacion(false);
    }
  };

  // Calcular progreso (como en la web)
  const totalCompletados = Object.values(formularios).filter(Boolean).length;
  const procesoListo = totalCompletados === maquinas.length;

  // Pantalla de carga
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007c64" />
        <Text style={styles.loadingText}>Cargando lotes pendientes...</Text>
      </View>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={cargarDatos}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Sin lotes pendientes
  if (lotes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noResultsText}>No hay lotes pendientes para certificar</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={cargarDatos}
        >
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedLote ? (
        // Vista de detalle del lote (como en la web)
        <View style={styles.detalleContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleVolverALista} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🚚 Proceso de Transformación – Lote #{selectedLote}</Text>
          </View>

          {loadingDetalle ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#007c64" />
              <Text style={styles.loadingText}>Cargando detalle del lote...</Text>
            </View>
          ) : loteDetalle ? (
            <View style={styles.detalleContent}>
              <View style={styles.detalleCard}>
                <Text style={styles.detalleTitle}>Información del Lote</Text>
                <Text style={styles.detalleText}>ID: {loteDetalle.IdLote}</Text>
                <Text style={styles.detalleText}>Nombre: {loteDetalle.Nombre}</Text>
                <Text style={styles.detalleText}>
                  Estado: {loteDetalle.Estado}
                </Text>
                <Text style={styles.detalleText}>
                  Fecha creación: {new Date(loteDetalle.FechaCreacion).toLocaleDateString()}
                </Text>
                {loteDetalle.Proceso && (
                  <Text style={styles.detalleText}>
                    Proceso: {loteDetalle.Proceso.Nombre}
                  </Text>
                )}
              </View>

              {/* Mostrar selector si no hay proceso asignado */}
              {!loteDetalle.IdProceso ? (
                <View style={styles.noProcesoCard}>
                  <Text style={styles.noProcesoText}>
                    Este lote no tiene un proceso asignado.
                  </Text>
                  <Text style={styles.noProcesoSubtext}>
                    Contacta al administrador para asignar un proceso.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Progreso del proceso */}
                  <View style={styles.progresoCard}>
                    <Text style={styles.progresoTitle}>
                      Progreso: {totalCompletados} / {maquinas.length} máquinas completadas
                    </Text>
                    <View style={styles.progresoBar}>
                      <View 
                        style={[
                          styles.progresoFill, 
                          { width: `${(totalCompletados / maquinas.length) * 100}%` }
                        ]} 
                      />
                    </View>
                  </View>

                  {/* Máquinas del proceso */}
                  {maquinas.length > 0 && (
                    <View style={styles.maquinasContainer}>
                      <Text style={styles.maquinasSectionTitle}>Máquinas del Proceso</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.maquinasGrid}>
                          {maquinas.map((maquina, index) => {
                            const completada = formularios[maquina.Numero];
                            const bloqueada = index > 0 && !formularios[maquinas[index - 1].Numero];

                            return (
                              <TouchableOpacity
                                key={maquina.Numero}
                                style={[
                                  styles.maquinaCard,
                                  completada && styles.maquinaCardCompletada,
                                  bloqueada && styles.maquinaCardBloqueada
                                ]}
                                onPress={() => !bloqueada && handleCertificarMaquina(maquina.Numero)}
                                disabled={bloqueada}
                              >
                                <View style={styles.maquinaImageContainer}>
                                  {maquina.Imagen ? (
                                    <Image
                                      source={{ uri: maquina.Imagen }}
                                      style={{ width: 70, height: 70, borderRadius: 8 }}
                                      resizeMode="contain"
                                    />
                                  ) : (
                                    <Text style={styles.maquinaImagePlaceholder}>
                                      ⚙️ Máquina
                                    </Text>
                                  )}
                                </View>
                                <Text style={styles.maquinaTitle}>
                                  #{maquina.Numero} – {maquina.Nombre}
                                </Text>
                                <View style={styles.maquinaEstado}>
                                  {completada ? (
                                    <FontAwesome5 name="check-circle" size={20} color="#007c64" />
                                  ) : bloqueada ? (
                                    <FontAwesome5 name="lock" size={20} color="#9ca3af" />
                                  ) : (
                                    <FontAwesome5 name="clock" size={20} color="#f59e0b" />
                                  )}
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  )}

                  {/* Botón para finalizar proceso */}
                  {procesoListo && (
                    <TouchableOpacity style={styles.finalizarButton}>
                      <Text style={styles.finalizarButtonText}>✅ Finalizar Proceso</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.errorText}>No se pudo cargar el detalle del lote</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => cargarDetalleLote(selectedLote)}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // Vista de lista de lotes
        <>
          <View style={styles.header}>
            <Text style={styles.title}>🚚 Gestión de Lotes Pendientes</Text>
            <Text style={styles.subtitle}>Selecciona un lote para iniciar su proceso de transformación</Text>
          </View>

          <FlatList
            data={lotes}
            keyExtractor={(item) => item.IdLote.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleSeleccionarLote(item.IdLote)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Lote #{item.IdLote}</Text>
                  <View style={[styles.badge, item.Estado === 'Pendiente' ? styles.badgePending : styles.badgeCompleted]}>
                    <Text style={styles.badgeText}>{item.Estado}</Text>
                  </View>
                </View>
                <Text style={styles.cardText}>
                  <Text style={styles.cardLabel}>Nombre:</Text> {item.Nombre}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.cardLabel}>Fecha de creación:</Text> {new Date(item.FechaCreacion).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#007c64"]}
              />
            }
          />
        </>
      )}

      {/* Modal para certificar máquina */}
      <Modal
        visible={showFormulario}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCerrarFormulario}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                #{maquinaSeleccionada?.Numero} – {maquinaSeleccionada?.Nombre}
              </Text>
              <TouchableOpacity onPress={handleCerrarFormulario} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {maquinaSeleccionada?.Variables?.map((variable, index) => (
                <View key={`${maquinaSeleccionada.Numero}-${variable.Nombre}-${index}`} style={styles.variableInput}>
                  <Text style={styles.variableLabel}>
                    {variable.Nombre} ({variable.ValorMin} – {variable.ValorMax})
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      variablesIngresadas[variable.Nombre] === "" && styles.inputEmpty,
                      errores[variable.Nombre] && styles.inputError,
                      !errores[variable.Nombre] && variablesIngresadas[variable.Nombre] !== "" && styles.inputValid
                    ]}
                    placeholder="Ingresa el valor"
                    keyboardType="numeric"
                    value={variablesIngresadas[variable.Nombre]?.toString() || ""}
                    onChangeText={(text) => handleActualizarVariable(variable.Nombre, text)}
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                    textContentType="none"
                  />
                  {errores[variable.Nombre] && (
                    <Text style={styles.errorText}>Valor fuera de rango permitido.</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, loadingCertificacion && styles.modalButtonDisabled]}
                onPress={handleEnviarFormulario}
                disabled={loadingCertificacion}
              >
                {loadingCertificacion ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>Guardar y volver</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgePending: {
    backgroundColor: '#fff3cd',
  },
  badgeCompleted: {
    backgroundColor: '#d4edda',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detalleContainer: {
    flex: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007c64',
    fontWeight: '600',
  },
  detalleContent: {
    padding: 16,
  },
  detalleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detalleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  detalleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  maquinasContainer: {
    marginBottom: 16,
  },
  maquinasSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  maquinasGrid: {
    flexDirection: 'row',
  },
  maquinaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 150,
    alignItems: 'center',
  },
  maquinaCardCompletada: {
    backgroundColor: '#e8f5e9',
    borderColor: '#007c64',
    borderWidth: 2,
  },
  maquinaCardBloqueada: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  maquinaImageContainer: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  maquinaImagePlaceholder: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  maquinaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007c64',
    textAlign: 'center',
    marginBottom: 8,
  },
  maquinaEstado: {
    alignItems: 'center',
  },
  noProcesoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noProcesoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  noProcesoSubtext: {
    fontSize: 14,
    color: '#666',
  },
  progresoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progresoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  progresoBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    height: 8,
  },
  progresoFill: {
    backgroundColor: '#007c64',
    borderRadius: 4,
    height: 8,
  },
  finalizarButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  finalizarButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007c64',
  },
  modalBody: {
    maxHeight: 400,
  },
  variableInput: {
    marginBottom: 16,
  },
  variableLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  inputEmpty: {
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  inputValid: {
    borderColor: '#2e7d32',
  },
  modalFooter: {
    marginTop: 16,
  },
  modalButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});