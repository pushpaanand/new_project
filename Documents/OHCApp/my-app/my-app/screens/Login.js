import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkBoxDisable, setCheckBoxDisable] = useState(false);


  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const navigation = useNavigation();

  const validateMobileNumber = () => {
    const phoneRegex = /^[6-9]\d{9}$/; 
    if (!phoneRegex.test(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (validateMobileNumber()) {      
      // Alert.alert('Login Successful', 'You will be navigated to the home screen.');
      navigation.navigate('Otp');
    }
  };

  const enableButton = (mobileNumber, isChecked) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (phoneRegex.test(mobileNumber) && isChecked) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/logo.png')} style={styles.mainImage} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={(text) => {
          setMobileNumber(text);
          enableButton(text, isChecked);
        }}
      />

      <TouchableOpacity
        style={styles.TAndCView}
        activeOpacity={1}
        disabled={checkBoxDisable}
        onPress={() => setChecked(!checked)}>

        {/* Expo Checkbox */}
        <View style={styles.checkBoxView}>
          <Checkbox
            value={checked}
            onValueChange={setChecked}
            color={checked ? '#692367' : undefined} 
            disabled={checkBoxDisable} 
          />
        </View>

        {/* Terms and Conditions and Privacy Policy */}
        <View style={styles.TAndCTextView}>
          <Text style={styles.checkBoxText}>{'By clicking you agree to the '}</Text>
          <Text
            style={styles.checkBoxText2}
            onPress={() => navigation.navigate('TermsAndConditionLogin')}>
            {'Terms and conditions '}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={checked ? styles.buttonEnabled : styles.buttonDisabled}
        onPress={handleLogin}
        disabled={!checked}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: COLORS.secondaryColor
  },
  mainImage: {
    width: 250,  
    height: 250, 
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a02c5a', 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a02c5a', 
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10
  },
  // checkboxText: {
  //   marginLeft: 10,
  //   fontSize: 14,
  // },
  TAndCView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30,
    marginLeft: 10
  },
  checkBoxView: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TAndCTextView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkBoxText: {
    fontSize: 14,
    color: '#692367',
  },
  checkBoxText2: {
    fontSize: 14,
    color: '#692367', 
    textDecorationLine: 'underline', 
  },
  linkText: {
    color: '#a02c5a',
    textDecorationLine: 'underline',
  },
  buttonEnabled: {
    backgroundColor: '#692367', 
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#692367', 
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
