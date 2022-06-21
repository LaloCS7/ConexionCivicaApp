import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { PermissionsProvider } from './src/context/PermissionContext';
import { AuthProvider } from './src/context/AuthContext';
import { ReportsProvider } from './src/context/ReportsContext';

/* Permisos de ubicacion */
const AppState = ({ children }: any) => {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <ReportsProvider>
          { children }
        </ReportsProvider>
      </PermissionsProvider>
    </AuthProvider>
  )
}

/* Verificar que esta logueado 
const AppState1 = ({ children }: any) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  )
} */

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        {/* <AppState1> */}
          <Navigator />      
        {/* </AppState1> */}
      </AppState>
    </NavigationContainer>
  )
}


export default App;