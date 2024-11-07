import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntroSlider from '../screens/IntroSlider';
import TabNavigator from './TabNavigator';
import { AuthContext } from './Authentication';

const Stack = createStackNavigator();

const AppNavigator = () => {
  //   const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { isFirstLaunch } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      {isFirstLaunch == true ?
        <IntroSlider />
        : <TabNavigator />
        //   <Stack.Screen name="LoginScreen" component={LoginScreen} />

      }
      {/* </Stack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;