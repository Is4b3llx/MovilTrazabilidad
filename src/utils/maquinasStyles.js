import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E6F2E6',
  },
  container: {
    padding: 16,
    backgroundColor: '#E6F2E6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'transparent', // sin color de fondo
    borderWidth: 1,
    borderColor: 'black', // borde negro
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 6, // sombra para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    color: '#2E8B57', // verde para el título
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  detail: {
    color: '#000', // texto negro
    fontSize: 16,
    lineHeight: 22,
  },
});

export default styles;
