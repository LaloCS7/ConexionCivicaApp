import { useEffect, useState, useRef } from 'react';

import Geolocation from '@react-native-community/geolocation';
import { Location } from '../interfaces/appInterfaces';

//import { LogBox } from 'react-native';

export const useLocation = () => {

    /* LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message    
    LogBox.ignoreAllLogs(); //Ignore all log notifications */

    const [ hasLocation, setHasLocation ] = useState(false);
    const [ initialPosition, setinitialPosition ] = useState<Location>({
        //Los inicializamos en 0 para que siempre tenga un valor
        longitude: 0,
        latitude: 0
    });

    const [userLocation, setUserLocation] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    const watchId = useRef<number>();
    const isMounted = useRef(true);

    useEffect(() => {
      isMounted.current = true;
    
      return () => {
        isMounted.current = false;
      }
    }, [])
    

    //Lamada asincrona
    useEffect(() => {
        getCurrentLocation()
            .then( location => {

                if( !isMounted.current ) return;

                //Obtenemos las coordenadas del usuario
                setinitialPosition(location);

                setUserLocation(location);
                
                //Mandamos la bandera que ya las tenemos
                setHasLocation(true);
            });  
    }, []);


    const getCurrentLocation = (): Promise<Location> => {
        return new Promise( (resolve, reject) => {
            Geolocation.getCurrentPosition(
                ({ coords }) => {
                    
                    //Obtenemos las coordenadas del usuario
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    });
                },
                (err) => reject({ err }), { enableHighAccuracy: true }
            );  
        });
    }

        //Funcion para seguir la ubi del usuario
    const followUserLocation = () => {
        watchId.current = Geolocation.watchPosition(
            ({ coords }) => {

                if( !isMounted.current ) return;

                const location: Location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }

                setUserLocation ( location );
                
            },
            (err) => console.log(err), { enableHighAccuracy: true, distanceFilter: 10 }
        );
    }

    const stopFollowUserLocation = () => {
        if( watchId.current )
            Geolocation.clearWatch( watchId.current );
    }

    return {
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation,
        userLocation
    }
}
