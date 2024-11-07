import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>Hi,</Text>
        <Text style={styles.nameText}>Ms.Pushpalakshmi A</Text>
        <TouchableOpacity style={styles.mainMenuButton}>
          <Text style={styles.mainMenuText}>Main Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Main Cards */}
      <View style={styles.cardContainer}>
        {/* Health Score Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HealthScore')}>
          <Image source={require('../assets/healthscore.png')} style={styles.icon} />
          <Text style={styles.cardText}>Check your health score</Text>
        </TouchableOpacity>

        {/* Book Appointment Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Teleconsultation')}>
          <Image source={require('../assets/calender.png')} style={styles.icon} />
          <Text style={styles.cardText}>Book an appointment</Text>
        </TouchableOpacity>

        {/* Disabled Buttons */}
        <TouchableOpacity style={styles.disabledCard}>
          <Image source={require('../assets/bookmedicine.png')} style={styles.iconDisabled} />
          <Text style={styles.disabledText}>Book medicine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disabledCard}>
          <Image source={require('../assets/bookdiagnostic.png')} style={styles.iconDisabled} />
          <Text style={styles.disabledText}>Book diagnostic</Text>
        </TouchableOpacity>
      </View>

      {/* Health Tips */}
      <View style={styles.healthTipsContainer}>
        <Text style={styles.healthTipsTitle}>Health Tips</Text>
        <Text style={styles.healthTipsText}>Eat Healthy Meals</Text>
        <Text style={styles.healthTipsText}>Stay Hydrated</Text>
        <Text style={styles.healthTipsText}>Exercise regularly</Text>
        <Text style={styles.healthTipsText}>Sleep Well</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  greetingText: {
    fontSize: wp('5%'),
    color: '#692367',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: wp('5%'),
    color: '#692367',
    fontWeight: 'bold',
  },
  mainMenuButton: {
    backgroundColor: '#692367',
    padding: wp('2%'),
    borderRadius: 5,
  },
  mainMenuText: {
    color: '#fff',
    fontSize: wp('4%'),
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FDEDED',
    width: wp('42%'),
    padding: wp('5%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
    marginBottom: hp('1%'),
  },
  cardText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledCard: {
    backgroundColor: '#EAEAEA',
    width: wp('42%'),
    padding: wp('5%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    borderRadius: 10,
  },
  iconDisabled: {
    width: wp('10%'),
    height: wp('10%'),
    marginBottom: hp('1%'),
    tintColor: 'gray',
  },
  disabledText: {
    fontSize: wp('4%'),
    color: 'gray',
    textAlign: 'center',
  },
  healthTipsContainer: {
    backgroundColor: '#F0F8E7',
    padding: wp('5%'),
    borderRadius: 10,
    marginTop: hp('2%'),
  },
  healthTipsTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  healthTipsText: {
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
  },
});

export default HomeScreen;
