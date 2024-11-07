import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

export default function SettingsScreen() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const navigation = useNavigation();

  const toggleNotification = () => setIsNotificationEnabled(previousState => !previousState);

  const handleProfileSettings = () => {
    // Navigate to Profile Settings screen
    navigation.navigate('profile');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      `Are you sure want to logout`,
      [
        { text: "NO", style: "cancel" },
        { text: "YES", onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separatorLine} />
      
      <TouchableOpacity style={styles.button} onPress={() => handleProfileSettings()}>
        <Text style={styles.buttonText}>Profile Settings</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <View style={styles.notificationContainer}>
        <Text style={styles.buttonText}>Notification {isNotificationEnabled ? 'On' : 'Off'}</Text>
        <Switch
          trackColor={{ false: '#fff', true: '#fff' }}
          thumbColor={isNotificationEnabled ? '#fcdf77' : '#fcdf77'}
          onValueChange={toggleNotification}
          value={isNotificationEnabled}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: 30,
      padding: 20
  },
  separatorLine: {
    height: 5, // Thick line
    backgroundColor: '#692367',
    width: '100%',
    marginBottom: 20,
    padding: 0
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5e0b55',
    alignSelf: 'center',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5e0b55',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5e0b55',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
