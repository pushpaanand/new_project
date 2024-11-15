import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const screenWidth = Dimensions.get('window').width;

const allergyData = [
  {
    allergies: 'Rashes',
    firstNoted: '01-Oct-2024',
  },
  {
    allergies: 'giddiness',
    firstNoted: '01-Oct-2024',
  },
];

export default function Allergies() {
  const route = useRoute();
  const [message, setMessage] = useState(route.params?.message ? route.params?.message : '');
  const navigation = useNavigation();

  const inputRefs = useRef([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container1}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
        <Text style={styles.headerText}>Allergies</Text>
        <Ionicons name="add-circle-outline" size={30} color="#6b1f58" onPress={() => navigation.navigate('addallergy')}/>
      </View>

      {/* Thick line below header */}
      <View style={styles.separatorLine} />

      {/* Image before instructions */}
      <Image source={require('../assets/allergiesimg.png')} style={styles.image} />

      {/* {allergyData ? (
        <ScrollView style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Allergies</Text>
              <Text style={styles.tableHeaderText}>First Noted</Text>
              <Text style={styles.tableHeaderText}>Next Vaccination Date</Text>
            </View>

            {allergyData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
                <Text style={styles.tableRowText}>{item.allergies}</Text>
                <Text style={styles.tableRowText}>{item.firstNoted}</Text>
                <Text style={styles.tableRowText}>{item.nextVaccinationDate}</Text>
              </View> */}
              {allergyData ? (
               <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Allergies</Text>
              <Text style={styles.tableHeaderText}>First Noted</Text>
              {/* <Text style={styles.tableHeaderText}>Next Vaccination Date</Text> */}
            </View>
            {allergyData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}
                 >
                <Text style={styles.tableRowText}>{item.allergies}</Text>
                <Text style={styles.tableRowText}>{item.firstNoted}</Text>
                {/* <Text style={styles.tableRowText}>{item.nextVaccinationDate}</Text> */}
              </View>
            ))}
          </View>
        
      ) : (
        <View style={styles.otpContainer}>
          <Text style={styles.title}>No data available</Text>
        </View>
      )}

      {message ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{message}</Text>
        </View>
      ) : null}
      </View>
    </ScrollView>
    
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b1f58',
  },
  backButton: {
    marginVertical: 20,
  },
  icon: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#692367', // Matching color
  },
  separatorLine: {
    height: 5, // Thick line
    backgroundColor: '#692367',
    width: '100%',
    marginBottom: 20,
    padding: 0
  },
  // image: {
  //   width: '100%',
  //   height: '40%',
  //   marginBottom: 20,
  // },
  image: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.6,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 50
  },
  tableContainer: {
    margin: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6b1f58',
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  alternateRow: {
    backgroundColor: '#f3e5f5',
  },
  tableRowText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  successMessageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ddc9de',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
},
successMessage: {   
    color: '#692367',
    fontSize: 16,
},
});
