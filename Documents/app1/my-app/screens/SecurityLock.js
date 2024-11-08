import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { BlurView } from 'expo-blur';

const SecurityLock = () => {
  const navigation = useNavigation();
  const [showLogo, setShowLogo] = useState(false);
  const [loading, setLoading] = useState(true);

const handleSetSecurityLock = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable security lock',
          fallbackLabel: 'Use passcode',
        });
  
        if (result.success) {
          
          await SecureStore.setItemAsync('securityLockEnabled', 'true');
          navigateToLogo(); 
        } else {
          
          Alert.alert('Authentication Failed', 'Could not authenticate');
        }
      } else {
        Alert.alert(
          'Security Setup Required',
          'No biometric or passcode authentication found. Please enable a security method in your device settings.'
        );
      }
    } catch (error) {
      console.log("Error setting security lock:", error);
      Alert.alert('Error', 'An error occurred while setting up security lock.');
    }
  };

  const navigateToLogo = () => {
    setLoading(false);
    setTimeout(() => {
      navigation.replace('Login');
    }, 1000); 
  };

  const showSecurityDialog = () => {
    Alert.alert(
      "Security Lock Request",
      "Welcome, do you want to set a security code?",
      [
        { text: "NO", onPress: navigateToLogo },
        { text: "YES", onPress: handleSetSecurityLock }
      ]
    );
  };

  useEffect(() => {
    showSecurityDialog();
  }, []);

  return (
    <View style={styles.container}>
      
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        {loading && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="38" fontWeight="bold" color="#692367" />
                    </View>
                </BlurView>
                )}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a black shadow-like background
},
});

export default SecurityLock;
