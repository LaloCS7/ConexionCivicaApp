import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button, Image} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { StackScreenProps } from '@react-navigation/stack';
import { ReportsStackParams } from '../navigator/ReportsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ReportsContext } from '../context/ReportsContext';


interface Props extends StackScreenProps<ReportsStackParams, 'ReportScreen'>{}; //Stack para traer los datos




export const ReportScreen = ({ navigation, route }: Props) => {

  const { id = '', name = '' } = route.params;

  const [ tempUri, setTempUri ] = useState<string>()

  //TODO importar el hook de la ubicacion

  const { categories } = useCategories();
  const { loadReportById, addReport, updateReport, uploadImage } = useContext( ReportsContext )

  const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: ''
  });


  useEffect(() => {
    navigation.setOptions({
      title: ( name ) ? name : 'Crear reporte'
    });
  }, [])

  useEffect(() => {
    loadReport();
  }, [])
  


  const loadReport = async () => {
    if( id.length === 0 ) return;

    const report = await loadReportById( id );
    setFormValue({
      _id: id,
      categoriaId: report.categoria._id,
      img: report.img || '',
      nombre: nombre
    })
  }
  
  //Verifica si e una actualizacion o un nuevo registro
  const saveOrUpdate = async () => {
    if( id.length > 0 ){
      console.log('flujo actualizar')
      updateReport( categoriaId, nombre, id );
    } else {
      const temCategoriaId = categoriaId || categories[0]._id;
      console.log('flujo nuevo')
      const newReport = await addReport( temCategoriaId, nombre );
      onChange( newReport._id, '_id' );
    }
  }

  //Funcion personalizada para la toma de fotos
  const takePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.5,
    }, (resp) => {
      if( resp.didCancel ) return;
      if  ( !resp.assets?.[0].uri ) return
      
      setTempUri(resp.assets?.[0].uri)
      uploadImage( resp, _id );
    });
  }

  const takePhotoFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    }, (resp) => {
      if( resp.didCancel ) return;
      if  ( !resp.assets?.[0].uri ) return
      
      setTempUri(resp.assets?.[0].uri)
      uploadImage( resp, _id );
    });
  }

  return (
    <View style={ styles.container }>

      <ScrollView>

        <Text style={ styles.label }>Nombre: </Text>
        <TextInput 
          placeholder='Descripción'
          style={ styles.textInput }
          value={ nombre }
          onChangeText={ ( value ) => onChange( value, 'nombre' ) }
          onSubmitEditing={ () => saveOrUpdate() }
        />

        {/* Selector */}
        <Text style={ styles.label }>Categoría: </Text>
        <Picker style={ styles.selector }
          selectedValue={ categoriaId }
          onValueChange={ ( value ) => onChange( value, 'categoriaId' ) }
        >

        {
          categories.map( c => (
            <Picker.Item 
              label={ c.nombre } 
              value={ c._id } 
              key= { c._id }
            />
          ))
        }
        </Picker>

        {
          /*  Valida si hay imagen se muestre en pantalla */
          ( img.length > 0  && !tempUri ) && (
            <Image 
              source={{ uri: img }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300
              }}
            />
          )
        }
        

        {
          /* TODO Mostrar imagen temporal */
          ( tempUri ) && (
            <Image 
              source={{ uri: tempUri }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300
              }}
            />
          )
        }

        {
          (id.length > 0) && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Button
                title="Tomar foto"
                onPress={ takePhoto }  
                color="#5856D6"          
              />
      
              <View style={{ width: 10}}/>
                <Button
                  title="Galeria"
                  onPress={ takePhotoFromGallery }  
                  color="#5856D6"          
                />
            </View>   
          )
        }

        <View style={{ justifyContent: 'center', marginTop: 10 }}>
          {/* Boton */}
          <Button
            title="Guardar"
            onPress={ saveOrUpdate }  
            color="#5856D6"          
          />
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10
  },
  label:{
    fontSize: 18,
    color: 'black'
  }, 
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45, //tamaño del inputText
    marginTop: 7,
    marginBottom: 15,
    color: 'black'
  }, 
  selector: {
    color: 'black'
  }
});
