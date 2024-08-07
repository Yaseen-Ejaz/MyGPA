import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, {useState} from 'react';
import {
    DotIndicator,
  } from 'react-native-indicators';
  import * as Font from "expo-font";

import Icon from 'react-native-vector-icons/MaterialIcons';
import Apploading from "expo-app-loading";


const getFonts = () =>
  Font.loadAsync({
    SansMedium: require('./assets/fonts/ProductSans-Medium.ttf'),
    SansBold: require('./assets/fonts/ProductSans-Bold.ttf'),
  });

const LoadingScreen = () => {

  const [fontsloaded, setFontsLoaded] = useState(false);

  if (!fontsloaded) {
    return <Apploading
    startAsync={getFonts}
    onFinish={() => {
      setFontsLoaded(true);
    }}
    onError={console.warn}

  />;
  }

    if(fontsloaded)
    {
      return (
        <SafeAreaView style={styles.container}>

        <View style={styles.container}>
        <View >
          <Text style={{fontSize:40, fontFamily:"SansMedium"}}>MyGPA</Text>
          </View>
          <DotIndicator color="black" />
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                  <Icon name="copyright" size={25} color="#333" />
                  <Text style={{fontFamily:"SansMedium"}}>Developed by Yaseen Ejaz Ahmed</Text>
          </View>
        </View>
        </SafeAreaView>
      );
  }
    else {
      return (
        <Apploading
          startAsync={getFonts}
          onFinish={() => {
            setFontsLoaded(true);
          }}
          onError={console.warn}
        />
      );
    } 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#C1E5FF",
    paddingTop:100,
    paddingBottom:100,

  },
  
  name:
  {  }
});

export default LoadingScreen;
