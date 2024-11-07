import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const FloatingLabelInput = ({ label, value, onChangeText, keyboardType, isRequired, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, (isFocused || value) && styles.labelFocused]}>
                {label}{isRequired && ' *'}
            </Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType={keyboardType}
                placeholder={isFocused ? '' : ''}
            />
        </View>
    );
};

const AddSugar = () => {
    const formatDate = (date) => {
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleDateString('en-GB', options).replace(',', '');
    };
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [bloodSugar, setBloodSugar] = useState('');
    const [testedLocation, setTestedLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState({
        date: false,
        bloodSugar: false,
        testedLocation: false,
        notes: false,
    });

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        setFormattedDate(formatDate(selectedDate));
        hideDatePicker();
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSave = () => {
        const newErrors = {};
        if (dropdownValue===null) newErrors.dropdown = 'Please select fasting type';
        if (bloodSugar==='') newErrors.bloodSugar = 'Please enter blood sugar level';
        if (testedLocation==='') newErrors.testedLocation = 'Please select tested with glucometer or at lab';
        else if (bloodSugar <= 30 || bloodSugar >= 1000) {
            newErrors.bloodSugar = 'Blood Sugar level should be in range of >=30 to <=1000';            
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Alert.alert('Data Saved', 'Blood Sugar data has been saved successfully');
            setLoading(true);
        setTimeout(() => {
            setLoading(false); 
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigation.navigate('sugar', { message: 'New blood sugar added successfully!' });
                setShowSuccessMessage(false);  
            }, 2000); 
        }, 2000); 
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#692367" />
            </TouchableOpacity>

            <Text style={styles.title}>Add Blood Sugar</Text>

            <View style={styles.separatorLine} />
            {/* Dropdown */}
            <RNPickerSelect
                onValueChange={(value) => setDropdownValue(value)}
                items={[
                    { label: 'Fasting', value: 'fasting' },
                    { label: 'Random', value: 'random' },
                ]}
                placeholder={{ label: 'Select', value: null }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
            />
            {errors.dropdown && <Text style={styles.errorText}>{errors.dropdown}</Text>}

            {/* Blood Sugar Input with Floating Label */}
            <FloatingLabelInput
                label="is (mg/dl)"
                value={bloodSugar}
                onChangeText={setBloodSugar}
                keyboardType="numeric"
                isRequired={true}
                placeholder="is (mg/dl)"
            />
            {errors.bloodSugar && <Text style={styles.errorText}>{errors.bloodSugar}</Text>}

            {/* Date Picker */}
            {/* <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )} */}

            <View style={styles.inputContainer}>
                <Text style={isFocused.date || date ? styles.labelFocused : styles.label}>
                    Date and Time *
                </Text>
                <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                        style={styles.input}
                        value={formattedDate}
                        editable={false}  // Prevent manual editing of date
                        onFocus={() => handleFocus('date')}
                        onBlur={() => handleBlur('date')}
                    />
                </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
            />

            {/* Radio Buttons */}
            <View style={styles.radioGroup}>
                <RadioButton
                    value="with_glucometer"
                    status={testedLocation === 'with_glucometer' ? 'checked' : 'unchecked'}
                    onPress={() => setTestedLocation('with_glucometer')}
                    color="#692367"
                />
                <Text style={styles.radioLabel}>With Glucometer *</Text>

                <RadioButton
                    value="at_lab"
                    status={testedLocation === 'at_lab' ? 'checked' : 'unchecked'}
                    onPress={() => setTestedLocation('at_lab')}
                    color="#692367"
                />
                <Text style={styles.radioLabel}>At Lab *</Text>
            </View>
            {errors.testedLocation && <Text style={styles.errorText}>{errors.testedLocation}</Text>}

            {/* Notes Input */}
            <FloatingLabelInput
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes"
            />

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {loading && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    </BlurView>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    //   header: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#6A1B4D',
    //     textAlign: 'center',
    //     marginBottom: 20,
    //   },
    header: {
        flexDirection: 'row',
        // alignItems: 'spa',
        justifyContent: 'space-between',
        // backgroundColor: '#800080',

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
        textAlign: 'center',
    },
    separatorLine: {
        height: 5,
        backgroundColor: '#692367',
        width: '100%',
        marginBottom: 20,
    },
    // inputContainer: {
    //     marginBottom: 16,
    //     borderBottomWidth: 1,
    //     borderColor: '#D3D3D3',
    // },
    inputContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        padding: 10,
    },
    label: {
        position: 'absolute',
        left: 10,
        top: 12,
        fontSize: 16,
        color: '#692367',
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },
    labelFocused: {
        top: -10,
        fontSize: 12,
        color: '#692367',
    },
    input: {
        padding: 0,
        paddingTop: 20,
        fontSize: 16,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    radioLabel: {
        marginRight: 20,
        color: '#692367',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#692367',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
};

export default AddSugar;
