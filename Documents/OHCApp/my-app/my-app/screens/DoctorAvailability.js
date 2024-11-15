import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DoctorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitType, setVisitType] = useState('Consultation');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const timeSlots = [
    '10:45 AM', '11:00 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '10:00 AM', '10:15 AM', '10:30 AM', '11:15 AM',
  ];

  const selectSlot = (slot) => {
    setSelectedSlot(slot);
    Alert.alert(
      "Confirm Appointment",
      `You selected ${slot}. Do you want to confirm this time?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => handleConfirm() }
      ]
    );
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleConfirm = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Home');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {/* Header */}
      <View style={styles.container1}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
          <Text style={styles.headerTitle}>Availability</Text>
          <Ionicons name="refresh" size={24} color="#6b1f58" />
        </View>
        <View style={styles.separatorLine} />

        {/* Date Picker */}
        <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.label}>Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={styles.input1}
              value={selectedDate.toISOString().split('T')[0]} // Format to YYYY-MM-DD
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          ) : (
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
              <FontAwesome name="calendar" size={24} color="#6b2045" />
            </View>
          )}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
          date={selectedDate}
        />

        {/* Visit Type */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Visit Type</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              value="Consultation"
              status={visitType === 'Consultation' ? 'checked' : 'unchecked'}
              onPress={() => setVisitType('Consultation')}
              color="#6b2045"
            />
            <Text style={styles.radioLabel}>Consultation</Text>

            <RadioButton
              value="Follow up"
              status={visitType === 'Follow up' ? 'checked' : 'unchecked'}
              onPress={() => setVisitType('Follow up')}
              color="#6b2045"
            />
            <Text style={styles.radioLabel}>Follow up</Text>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsLabel}>Time Slots</Text>
          {timeSlots ? (
            <View style={styles.slotsContainer}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slot,
                    selectedSlot === slot && styles.selectedSlot
                  ]}
                  onPress={() => selectSlot(slot)}
                >
                  <Ionicons name="time-outline" size={16} color="#6b2045" />
                  <Text style={styles.slotText}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.timeSlotsBox}>
              <Text style={styles.noSlotsText}>No time slots available</Text>
            </View>
          )}
        </View>
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#6b2045" />
              <Text style={styles.modalTitle}>Appointment Confirmed</Text>
              <Text style={styles.modalMessage}>
                Your payment of ₹500 was successfully completed and the appointment has been booked.
              </Text>
              <TouchableOpacity style={styles.okButton} onPress={handleCloseModal}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

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
    // marginLeft: '30%'
  },
  refreshIcon: {
    marginRight: 10,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
    borderColor: '#6b2045',
    borderWidth: 1,
  },
  label: {
    color: '#6b2045',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionLabel: {
    color: '#6b2045',
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 20,
  },
  timeSlotsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  timeSlotsLabel: {
    color: '#6b2045',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  timeSlotsBox: {
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6b2045',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noSlotsText: {
    color: '#999',
    fontSize: 16,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  input1: {
    height: 40,
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 10,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        paddingTop: 0,
        backgroundColor: '#fff',
        borderColor: '#fff',
        outlineStyle: 'none',
      },
    }),
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6b2045',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#fff',
  },
  selectedSlot: {
    backgroundColor: '#e2c4d1',
  },
  slotText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6b2045',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b2045',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  okButton: {
    backgroundColor: '#6b2045',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DoctorAvailability;
