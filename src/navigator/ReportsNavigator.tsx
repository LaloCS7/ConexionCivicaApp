import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReportsScreen } from '../pages/ReportsScreen';
import { ReportScreen } from '../pages/ReportScreen';
import { PermissionsContext } from '../context/PermissionContext';
import { LoadingScreen } from '../pages/LoadingScreen';
import { PermissionsScreen } from '../pages/PermissionsScreen';
import { MapScreen } from '../pages/MapScreen';

export type ReportsStackParams = {
    MapScreen: undefined,
    PermissionsScreen: undefined,
    ReportsScreen: undefined,
    ReportScreen: { id?: string, name?: string }
}

const Stack = createStackNavigator<ReportsStackParams>();


export const ReportsNavigator = () => {
    const { permissions } = useContext( PermissionsContext ); 
  
    if(permissions.locationStatus === 'unavailable' ){
      return <LoadingScreen />
    }

  return (
    <Stack.Navigator
        screenOptions={{
            cardStyle: {
                backgroundColor: 'white'
            },
            headerStyle: {
                elevation: 0,
                shadowColor: 'transparent'
            }
        }}
        >
        {
            (permissions.locationStatus !== 'granted')
            ? <Stack.Screen name="PermissionsScreen" component={ PermissionsScreen } />
            : <Stack.Screen name="MapScreen" component={ MapScreen } options={{headerShown: false}} />

        }

        <Stack.Screen 
            name="ReportsScreen"
            component={ ReportsScreen }
            options={{ title: 'Reportes' }}
        />
        <Stack.Screen 
            name="ReportScreen"
            component={ ReportScreen }
        />

    </Stack.Navigator>
  )
}
