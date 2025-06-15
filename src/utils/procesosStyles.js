import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E6F2E6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',         // fondo blanco
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,                  // borde negro
    borderColor: '#000',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',                // título verde
  },
  detail: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',                   // texto detalle gris oscuro
  },
  button: {
  padding: 8,
  borderRadius: 5,
},
buttonText: {
  color: 'white',
  textAlign: 'center',
  fontSize: 14,
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
});

export default styles;
