import React, { useContext, useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import { ReportsContext } from '../context/ReportsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ReportsStackParams } from '../navigator/ReportsNavigator'; //Checar


interface Props extends StackScreenProps<ReportsStackParams, 'ReportsScreen'>{};  //Checar


export const ReportsScreen = ({ navigation }: Props ) => { //checar

  const [isRefreshing, setIsRefreshing] = useState( false );
  const { reports, loadReports } = useContext( ReportsContext ); //checar

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={ 0.3 }
          style={{ marginRight: 10}}
          onPress={ () => navigation.navigate('ReportScreen', {}) }
        >
          <Text style={{ color: 'black' }}>Agregar</Text>
        </TouchableOpacity>
      )
    })
  }, [])
  

  //Pull to refresh
  const loadReportsFromBackend = async () => {
    setIsRefreshing(true);
    await loadReports();
    setIsRefreshing(false);
  }


  return (
    <View style={{
      flex: 1,
      marginHorizontal: 10
    }}>
        <FlatList 
          data={ reports }
          keyExtractor={ (p) => p._id }
          renderItem={ ({item}) => (
            <TouchableOpacity
              activeOpacity={ 0.3 }
              onPress={  //checar
                () => navigation.navigate('ReportScreen', { 
                  id: item._id,
                  name: item.nombre
                })
            } 
            >
              <Text style={ styles.reportName }>{ item.nombre }</Text>
            </TouchableOpacity>
          )}

            ItemSeparatorComponent={ () => (
              <View style={ styles.itemSeparator }
              />
            )}

            refreshControl={
              <RefreshControl 
                refreshing={ isRefreshing }
                onRefresh={ loadReportsFromBackend }
              />
            }

        />
    </View>
  )
}


const styles = StyleSheet.create({
  reportName: {
    fontSize: 20,
    color: 'black'
  },
  itemSeparator: {
    borderBottomWidth: 3,
    marginVertical: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)'
  }
});