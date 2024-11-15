import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']); 
  const [timer, setTimer] = useState(60); 
  const [loading, setLoading] = useState(false); 

  const navigation = useNavigation();

  const inputRefs = useRef([]);

  const handleVerify = () => {
    if (otp.join('') === '1234') {
      navigation.navigate('Home');
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text && index < 3) {
      inputRefs.current[index + 1].focus(); 
    }
    if (text === '' && index > 0) {
      inputRefs.current[index - 1].focus(); 
    }
    setOtp(newOtp);
  };

  // Back navigation handler
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
    
      <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
                <Text style={styles.headerTitle}>Verification</Text>
                {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
            </View>
            <View style={styles.separatorLine} />

      <Image source={require('../assets/otp.png')} style={styles.image} />

      <View style={styles.otpContainer}>
        <Text style={styles.instructions}>
          Please enter the 4 digit verification code sent to +91 XXXX XXX 060
        </Text>

        {/* OTP Input boxes */}
        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              textAlign="center"
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <Text style={styles.timerText}>
        Remaining Time: {`00:${timer < 10 ? '0' : ''}${timer}`}
      </Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
    // marginTop: 10
},
container1: {
    backgroundColor: '#fff',
    marginTop: 20,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  // justifyContent: 'space-between',
  padding: 20,
  backgroundColor: '#fff',

},
  backButton: {
    position: 'absolute',
    top: 50, 
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#692367', 
  },
  separatorLine: {
    height: 5, // Thick line
    backgroundColor: '#692367',
    width: '100%',
    marginBottom: 20,
    padding: 0
},
headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b1f58',
    marginLeft: '20%'
},
  image: {
    width: '50%',
    height: '20%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 7,
    borderRadius: 5,
    fontSize: 20,
    width: 40,
    marginHorizontal: 5,
    backgroundColor: '#d6d4d5',
  },
  verifyButton: {
    backgroundColor: '#692367', 
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 100,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
