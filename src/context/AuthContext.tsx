import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import cafeApi from '../api/cafeApi';

import { LoginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces';
import { AuthReducer, AuthState } from './authReducer';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signIn: ( loginData: LoginData ) => void; //Recibe un objeto de tipo LoginData
    signUp: ( registerData: RegisterData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}


export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(AuthReducer, authInitialState);

   //Chaca si el usuario tiene token
    useEffect(() => {
        checkToken();       
    }, [])

     //Obtener el token del usuario
    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');

        //No token, no autenticado
        if( !token ) return dispatch({ type: 'notAuthenticated' });

        const resp = await cafeApi.get('/auth');
        if( resp.status !== 200 ){
            return dispatch({ type: 'notAuthenticated' });
        }

        await AsyncStorage.setItem('token', resp.data.token);

        //Hay token
        dispatch({ 
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });

    }

    

    // Recibimos un correo y password de tipo LoginData que creamos en la interfaz
    const signIn = async ({ correo, password}: LoginData) => {
        try {
            //La API nos debe de responder con info de tipo LoginResponse que tambien creamos en interfaz
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            dispatch({ 
                type: 'addError', 
                payload: error.response.data.msg || 'Información incorrecta'
            })         
        }
    };

    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try {
            //La API nos debe de responder con info de tipo LoginResponse que tambien creamos en interfaz
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { nombre, correo, password });
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            dispatch({ 
                type: 'addError', 
                payload: error.response.data.errors[0].msg || 'Revisa tu datos ingresados'
            })         
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };

    const removeError = () => {
        dispatch({ type: 'removeError' })
    };

    return(
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>

    )

}