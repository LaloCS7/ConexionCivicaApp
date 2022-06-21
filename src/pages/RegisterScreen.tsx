import React, { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Logo } from '../components/Logo';
import { useForm } from '../hooks/useForm';

import { loginStyles } from '../themes/loginTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any>{}


export const RegisterScreen = ( { navigation }: Props) => {

  const { signUp, errorMessage, removeError } = useContext( AuthContext );

  const { name, email, password, onChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if(errorMessage.length == 0) return;

    Alert.alert( 'Registro incorrecto', errorMessage, [{
        text: 'Aceptar',
        onPress: removeError
      }] 
    );
  }, [ errorMessage ])

  const onRegister = () => {
    console.log({name, email, password});
    Keyboard.dismiss();
    signUp({
      nombre: name,
      correo: email,
      password
    });
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5856D6' }}
        behavior={( Platform.OS === 'ios') ? 'padding': 'height' }
      >

        <View style={ loginStyles.formContainer }>
          <Logo />

          <Text style={ loginStyles.title }>Registro</Text> 

          {/* Nombre */}
          <Text style={ loginStyles.label }>Nombre</Text>
          <TextInput 
            placeholder="Ingresa tu nombre"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            underlineColorAndroid='white'
            style={ loginStyles.inputField }
            selectionColor="white"

            //onChange
            onChangeText={ (value) => onChange(value, 'name') }
            //value
            value={ name }
            onSubmitEditing={ onRegister }

            autoCapitalize="words"
            autoCorrect={ false }

          /> 

          {/* Email */}
          <Text style={ loginStyles.label }>Email:</Text>
          <TextInput 
            placeholder="Ingresa tu correo electrónico"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            keyboardType="email-address"
            underlineColorAndroid='white'
            style={ loginStyles.inputField }
            selectionColor="white"

            //onChange
            onChangeText={ (value) => onChange(value, 'email') }
            //value
            value={ email }
            onSubmitEditing={ onRegister }

            autoCapitalize="none"
            autoCorrect={ false }
          /> 

          {/* Contraseña */}
          <Text style={ loginStyles.label }>Contraseña:</Text>
          <TextInput 
            placeholder="*********"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            underlineColorAndroid='white'
            secureTextEntry
            style={ loginStyles.inputField }
            selectionColor="white"

            //onChange
            onChangeText={ (value) => onChange(value, 'password') }
            //value
            value={ password }
            onSubmitEditing={ onRegister }

            autoCapitalize="none"
            autoCorrect={ false }
          /> 

          {/* Boton de login */}
          <View style={ loginStyles.buttonContainer }>
            <TouchableOpacity 
              activeOpacity={ 0.8 }
              style={ loginStyles.button }
              onPress={ onRegister }
            >
              <Text style={ loginStyles.buttonText }>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Regresar login */}
          <TouchableOpacity
            onPress={ () => navigation.replace('LoginScreen') }
            activeOpacity= { 0.8 }
            style={ loginStyles.buttonReturn }
          >
            <Text style={ loginStyles.buttonText }>Ingresar</Text>

          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </>
  )
}
