import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { KeyboardAvoidingView, Text, TextInput, View, Platform, Keyboard, TouchableOpacity, Alert } from 'react-native';

import { Background } from '../components/Background';
import { Logo } from '../components/Logo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../themes/loginTheme';
import { AuthContext } from '../context/AuthContext';



interface Props extends StackScreenProps<any, any> {}


export const LoginScreen = ({ navigation }: Props) => {

  //Usamos useContext para traer la funcion signIn de AuthContext
  const { signIn, errorMessage, removeError } = useContext( AuthContext );

  const { email, password, onChange } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {
    if(errorMessage.length == 0) return;

    Alert.alert( 'Credenciales incorrectas', errorMessage, [{
        text: 'Aceptar',
        onPress: removeError
      }] 
    );
  }, [ errorMessage ])
  

  const onLogin = () => {
    Keyboard.dismiss();
    signIn({ correo: email, password: password }); //correo es como esta en la bd, email es como esta en el fe
  }

  return (
    <>
      <Background />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={( Platform.OS === 'ios') ? 'padding': 'height' }
      >

        <View style={ loginStyles.formContainer }>
          <Logo />

          <Text style={ loginStyles.title }>Login</Text> 

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
            onSubmitEditing={ onLogin }

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
            onSubmitEditing={ onLogin }

            autoCapitalize="none"
            autoCorrect={ false }
          /> 

          {/* Boton de login */}
          <View style={ loginStyles.buttonContainer }>
            <TouchableOpacity 
              activeOpacity={ 0.8 }
              style={ loginStyles.button }
              onPress={ onLogin }
            >
              <Text style={ loginStyles.buttonText }>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Registro */}
          <View style={ loginStyles.newUserContainer }>
            {/* <TouchableOpacity
              activeOpacity={ 0.8 }
              onPress={ () => navigation.replace('RegisterScreen') }
            > */}
            <TouchableOpacity
              activeOpacity={ 0.8 }
              onPress={ () => navigation.replace('RegisterScreen')}
            >
              <Text style={ loginStyles.buttonText }>Crear cuenta</Text>

            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
