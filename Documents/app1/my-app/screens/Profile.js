import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
        <Text style={styles.headerTitle}>View Profile</Text>
        {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
      </View>
      <View style={styles.separatorLine} />

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-sharp" size={100} color="#cce8f9"
          style={styles.profileImage}
        />
        <Text style={styles.name}>Ms. Pushpalakshmi A</Text>
        <Text style={styles.age}>30 yrs</Text>
        <Text style={styles.memberId}>Member ID: OHC1122988772</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <ProfileDetail label="Gender" value="Male" />
        <ProfileDetail label="Blood Group" value="Unknown" />
        <ProfileDetail label="Department" value="Design" />
        <ProfileDetail label="Job Title" value="Asst Manager - Accounts" />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

// Reusable component for each detail row
const ProfileDetail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  separatorLine: {
    height: 5, // Thick line
    backgroundColor: '#692367',
    width: '100%',
    // marginBottom: 20,
    padding: 0
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b1f58',
    marginLeft: '30%'
  },
  profileContainer: {
    backgroundColor: '#e9d6e8',
    alignItems: 'center',
  },
  profileImage: {
    // width: 120,
    // height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 16,
    color: '#777',
    marginVertical: 5,
  },
  memberId: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#777',
    marginTop: 2,
  },
});

export default Profile;
