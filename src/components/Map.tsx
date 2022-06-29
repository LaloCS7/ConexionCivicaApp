import React, { useContext, useEffect,useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';
import { useNavigation } from '@react-navigation/native';


interface Props {
    attachReport: () => void;
    showReports: () => void;
    markers?: Marker[];
}

export const Map = ({ attachReport, showReports, markers }: Props) => {

    const navigation = useNavigation();

    const { user, logOut } = useContext( AuthContext );


    //Recibimos el estado de la ubicación y cual es la ubicación en caso de tenerla
    const { hasLocation, 
            initialPosition, 
            getCurrentLocation, 
            followUserLocation,
            userLocation, 
            stopFollowUserLocation } = useLocation();

    const mapViewRef = useRef<MapView>();
    const following = useRef<boolean>(true);

    useEffect(() => {
      followUserLocation();    
      return () => {
        stopFollowUserLocation();
      }
    }, [])

    useEffect(() => {

        if( !following.current ) return;

        const { latitude, longitude } = userLocation;
        mapViewRef.current?.animateCamera({
            center: { 
                latitude, 
                longitude
            },
            zoom: 15
        });
    }, [ userLocation ])
    
    

    const centerPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

        following.current = true;

        mapViewRef.current?.animateCamera({
            center: { 
                latitude, 
                longitude
            },
            zoom: 15
        });
    }

    //Valida si tenemos las coordenadas, en caso contrario se muestra el loader
    if( !hasLocation ){
        return <LoadingScreen/>
    }


    //Cuando tenemos la posición entonces si se muestra el mapa con la misma
  return (
    <>
        <MapView
            ref={ (el) => mapViewRef.current = el! }
            style={{ flex: 1 }}
            showsUserLocation
            initialRegion={{
                //Mostramos la posicion inicial en el mapa
                latitude: initialPosition.latitude,
                longitude: initialPosition.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}

            onTouchStart={ () => following.current = false }
        >
            <Marker
                image={ require('../assets/rojo.png') }
                coordinate={{ 
                    latitude: 19.507673,
                    longitude: -99.143960,
                }}
                title="Coladera destapada"
                description="En la avenida se encuentra una coladera que no tiene tapa"
            />
                <Marker
                image={ require('../assets/rojo.png') }
                coordinate={{ 
                    latitude: 19.507220,
                    longitude: -99.136793,
                }}
                title="Coladera destapada"
                description="En la avenida se encuentra una coladera que no tiene tapa"
            /> 
            <Marker
                image={ require('../assets/rojo.png') }
                coordinate={{ 
                    latitude: 19.507673,
                    longitude: -99.143960,
                }}
                title="Fuga de agua"
                description="Desde ayer se esta fugando el agua de la tuberia"
            /> 

               {/*  <Callout tooltip>
                    <View>
                        <View style={styles.bubble}>
                            <Text style={styles.name}>Reportes registrados</Text>
                            <Text>Descripcion corta</Text>
                            <Image
                                style={styles.image}
                                source={require('../assets/logoApp.png')}
                            />
                        </View>
                        <View style={styles.arrowBorder} />
                        <View style={styles.arrow} />
                    </View>
                </Callout> */}
        </MapView>
        
        {/* Nombre usuario
        <Text> { user }</Text> */}

        {/* Cerrar sesion */}
        <Fab 
            iconName="log-out-outline"
            onPress={ logOut }
            style={{
                position: 'absolute',
                top: 5,
                right: 20,
            }}    
        />

        {/* Boton ver reportes */}
        <Fab 
            iconName="list-outline"
            onPress={ showReports }
            style={{
                position: 'absolute',
                bottom: 130,
                right: 20,
            }}    
        />

        {/* Agregar reporte */}
        <Fab 
            iconName="add-circle-outline"
            onPress={ () => attachReport() }
            style={{
                position: 'absolute',
                bottom: 75,
                right: 20,
            }}    
        />

        {/* Centrar la ubicacion */}
        <Fab 
            iconName="locate-outline"
            onPress={ centerPosition }
            style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
            }}    
        />

    </>
  )
}


const styles = StyleSheet.create({
    bubble: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      backgroundColor: '#fff',
      borderRadius: 6,
      borderColor: '#ccc',
      borderWidth: 0.5,
      padding: 15,  
      width: 150
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: 0.5,
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
        color: 'black'
    },
    image: {
        width: 100,
        height: 60
    }
});