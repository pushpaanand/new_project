import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Teleconsultation = () => {
    const navigation = useNavigation();
    
    const handleAppointment = () => {
        navigation.navigate('list');
    }

    const handleBackPress = () => {
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.container1}> */}
      {/* Header */}
      <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
                <Text style={styles.headerTitle}>Teleconsultation</Text>
                {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
            </View>
            <View style={styles.separatorLine} />

      {/* No Data Text */}
      <View style={styles.otpContainer}>
        <Text style={styles.headerTitle}>No data available</Text>
      </View>

      {/* Floating Book Appointment Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAppointment}>
        <MaterialCommunityIcons name="calendar-check" size={24} color="#fff" />
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>

      {/* </View> */}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
    marginTop: 20
},
// container1: {
//     backgroundColor: '#fff',
//     marginTop: 20,
// },
header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',

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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#80004d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: height * 0.1, // adjust according to screen height
    alignSelf: 'center',
    backgroundColor: '#6b1f58',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5, // adds shadow for Android
    shadowColor: '#000', // adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  otpContainer: {
    marginBottom: 20,
    // alignItems: 'center',
    marginTop: '30%'
  },
});

export default Teleconsultation;
