import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
// import registerNNPushToken from 'native-notify';
import { AuthProvider } from './navigation/Authentication';
import AppNav from './navigation/AppNavigator';
import NetInfo from '@react-native-community/netinfo';
import 'react-native-gesture-handler';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        'Internet Required',
        'Connect to any WiFi or Mobile Data and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [isConnected]);

  // registerNNPushToken(9754, '2vQqWQ8PGRzmyLvJpKq6Dc');

  return (
    <View style={styles.container}>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
