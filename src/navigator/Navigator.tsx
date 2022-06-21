import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PermissionsContext } from '../context/PermissionContext';
import { AuthContext } from '../context/AuthContext';

import { LoadingScreen } from '../pages/LoadingScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { RegisterScreen } from '../pages/RegisterScreen';
import { ReportsNavigator } from './ReportsNavigator';



const Stack = createStackNavigator();

export const Navigator = () => {

  const { status } = useContext( AuthContext ); //Llevar a Splash
  const { permissions } = useContext( PermissionsContext ); 

  if( status === 'checking' ) return <LoadingScreen/> //Levar a splash

  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: {
                backgroundColor: 'white'
            }
        }}
        
    >
      {
        (status !== 'authenticated')
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={ LoginScreen } />
              <Stack.Screen name="RegisterScreen" component={ RegisterScreen } />
            </>
          )
          : <Stack.Screen name="ReportsNavigator" component={ ReportsNavigator } />
      }
      
    </Stack.Navigator>
  );
}