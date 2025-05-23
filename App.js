import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MateriasPrimasScreen from './screens/MateriasPrimasScreen'; // 👈🏼 nueva línea
import MaquinasScreen from './screens/MaquinasScreen';
import ProcesosScreen from './screens/ProcesosScreen'; // ajusta la ruta si es distinta

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Maquinas" component={MaquinasScreen} />
  <Stack.Screen name="Procesos" component={ProcesosScreen} />

        <Stack.Screen 
  name="MateriasPrimas" 
  component={MateriasPrimasScreen} 
  options={{ title: 'Materias Primas' }} 
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}