import React, { useContext, useEffect,useRef } from 'react';
import { Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';

interface Props {
    markers?: Marker[];
}

export const Map = ({ markers }: Props) => {

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
                    latitude: 19.308704,
                    longitude: -99.163363,
                }}
                title="Prueba título"
                description="Prueba descripción"
            /> 

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

        {/* Agregar reporte */}
        <Fab 
            iconName="add-circle-outline"
            onPress={ centerPosition }
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
