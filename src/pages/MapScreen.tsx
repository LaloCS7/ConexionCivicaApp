import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { Map } from '../components/Map';
import { ReportsStackParams } from '../navigator/ReportsNavigator';

interface Props extends StackScreenProps<ReportsStackParams, 'MapScreen'>{}; //Stack para traer los datos

export const MapScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex:1 }}>

      <Map
        attachReport={ () => navigation.navigate('ReportScreen', {})}
        showReports={ () => navigation.navigate('ReportsScreen')}
      />
      
    </View>
  )
}
