import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntroSlider from '../screens/IntroSlider';
import TabNavigator from './TabNavigator';
import { AuthContext } from './Authentication';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  //   const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { isFirstLaunch } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      {isFirstLaunch && Platform.OS !== 'web' ? (
        <IntroSlider />
      ) : (
        <TabNavigator />
      )}
      {/* </Stack.Navigator> */}
    </NavigationContainer>
  );
};

export default AppNavigator;