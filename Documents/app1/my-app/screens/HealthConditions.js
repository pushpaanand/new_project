import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this icon library is installed

export default function HealthConditions() {
  const [otp, setOtp] = useState(['', '', '', '']); // Store OTP in an array of 4
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds

  const navigation = useNavigation();

  // References for each OTP input box
  const inputRefs = useRef([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
        <Text style={styles.headerTitle}>Chronic Health Condition</Text>
        {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
      </View>

      <View style={styles.separatorLine} />

      {/* Image before instructions */}
      <Image source={require('../assets/healthcondition.png')} style={styles.image} />

      <View style={styles.otpContainer}>
        <Text style={styles.headerTitle}>No data available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6b1f58',
    marginLeft: '10%'
  },
  separatorLine: {
    height: 5, // Thick line
    backgroundColor: '#692367',
    width: '100%',
    marginBottom: 20,
    padding: 0
  },
  image: {
    width: '100%',
    height: '40%',
    marginBottom: 20,
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 50
  },
});
