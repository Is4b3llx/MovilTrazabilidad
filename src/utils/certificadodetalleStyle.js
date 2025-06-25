import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.04,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  backButton: {
    padding: width * 0.01,
    minWidth: width * 0.1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007c64',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    borderRadius: 6,
    minWidth: width * 0.25,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Math.min(width * 0.03, 12),
    marginLeft: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  certificadoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificadoHeader: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#007c64',
    paddingBottom: 16,
  },
  certificadoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  certificadoSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  certificadoFecha: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  materiasContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  materiaText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  maquinasContainer: {
    gap: 12,
  },
  maquinaCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
  },
  maquinaCardOk: {
    borderColor: '#4caf50',
    backgroundColor: '#f1f8e9',
  },
  maquinaCardFail: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  maquinaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  variablesContainer: {
    marginLeft: 8,
  },
  variableText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  variableLabel: {
    fontWeight: 'bold',
  },
  resultadoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resultadoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  resultadoOk: {
    backgroundColor: '#e8f5e8',
  },
  resultadoFail: {
    backgroundColor: '#ffebee',
  },
  resultadoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultadoMotivo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selloContainer: {
    position: 'absolute',
    top: '50%',
    right: 20,
    transform: [{ rotate: '15deg' }],
    opacity: 0.1,
  },
  selloText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007c64',
  },
});

export default styles; 