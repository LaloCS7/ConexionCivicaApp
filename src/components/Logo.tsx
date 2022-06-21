import React from 'react'
import { Image, View } from 'react-native'

export const Logo = () => {
  return (
    <View style={{
        alignItems:'center'
    }}>
        <Image
            source={ require('../assets/logoApp.png') }
            style={{
              width: 290,
              height: 130,
            }}
        />
    </View>
  )
}
