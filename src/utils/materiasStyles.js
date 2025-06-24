import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E6F2E6',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3CB371',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  // Modal
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
    shadowOffset: { width: 0, height: 2 },
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
});

export default styles;
