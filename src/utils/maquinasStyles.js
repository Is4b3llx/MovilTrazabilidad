import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // para Android shadow
    shadowColor: '#000', // para iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImageText: {
    fontStyle: 'italic',
    color: '#aaa',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  detail: {
    color: '#666',
  },
});
