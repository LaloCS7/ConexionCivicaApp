import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlackButton } from '../components/BlackButton';
import { PermissionsContext } from '../context/PermissionContext';

export const PermissionsScreen = () => {

  const { permissions, askLocationPermission } = useContext( PermissionsContext );
  
  return (
    <View style={ styles.container }>
        <Text style={ styles.titulo }>Por favor acepta los permisos para acceder a tu ubicación</Text>
        <BlackButton
          title='Permiso'
          onPress={ askLocationPermission }
        />

        <Text style={{ marginTop: 20, color: 'black' } }> { JSON.stringify(permissions, null, 5) } </Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    width: 250,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20
  }
});
