import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

const AddOxygen = () => {
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [readingMethod, setReadingMethod] = useState(null);
    const [oxygenLevel, setOxygenLevel] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const placeholder = Platform.OS === 'web' 
    ? { label: 'Reading Method *', value: null } 
    : { label: '', value: null };

    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
        
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSave = () => {
        const newErrors = {};
        if (!readingMethod) newErrors.readingMethod = 'Please select reading method';
        if (!oxygenLevel) newErrors.oxygenLevel = 'Please enter level';
        else if (oxygenLevel <= 60 || oxygenLevel >= 100) {
            newErrors.oxygenLevel = 'Oxygen level should be in range of >=60 to <=100';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            //   Alert.alert('Data Saved', 'New Oxygen Level data has been saved successfully');
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    navigation.navigate('oxygen', { message: 'New oxygen level added successfully!' });
                    setShowSuccessMessage(false);
                }, 2000);
            }, 2000);
        }
    };
console.log(time);
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#692367" />
            </TouchableOpacity>

            <Text style={styles.title}>Add Oxygen Level</Text>

            <View style={styles.separatorLine} />
            {/* Date and Time Picker */}
            {/* <Text style={[styles.label, (isFocused || date) && styles.labelFocused]}>Date and Time *</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                <Text>{date.toLocaleString()}</Text>
            </TouchableOpacity> */}
            <View style={styles.inputContainer}>
                    <Text style={[styles.label, isFocused.date || date ? styles.labelFocused : {}]}>
                    Date and Time *
                    </Text>
                    {Platform.OS === 'web' ? (
                        <View style={styles.webDateTimeContainer}>
                            <input
                                type="date"
                                style={styles.input1}
                                value={date.toISOString().split('T')[0]} // Format to YYYY-MM-DD
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                            <input
                                type="time"
                                style={styles.input1}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            </View>
                        ) : (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={showDatePicker}
                    >
                        <Text style={{ color: '#000' }}>
                            {date ? date.toLocaleString() : 'Select Date'}
                        </Text>
                    </TouchableOpacity>
                )}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={date}
            />
    </View>
            {/* Reading Method Dropdown */}
            {/* <Text style={styles.inputLabel}>Reading Method *</Text> */}
            <View style={styles.inputContainer}>
            <Text style={[styles.label, readingMethod ? styles.labelFocused : {}]}>Reading Method *</Text>
            <RNPickerSelect
                onValueChange={(value) => setReadingMethod(value)}
                items={[
                    { label: 'Pulse Oximeter', value: 'pulse_oximeter' },
                    { label: 'Lab Test', value: 'lab_test' },
                ]}
                placeholder={placeholder}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
            />
            {errors.readingMethod && <Text style={styles.errorText}>{errors.readingMethod}</Text>}
            </View>

            {/* Oxygen Level Input */}
            <FloatingLabelInput
                label="Level (%)"
                value={oxygenLevel}
                onChangeText={setOxygenLevel}
                keyboardType="numeric"
                isRequired={true}
                placeholder="Level (%)"
            />
            {errors.oxygenLevel && <Text style={styles.errorText}>{errors.oxygenLevel}</Text>}

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
        </View>
        </View>
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
        marginTop: 10,
        padding: wp('5%'),
    },
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
    inputContainer: {
        position: 'relative',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingTop: 18,
        backgroundColor: '#ffffff',
        ...Platform.select({
            web: {
                boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)', 
                borderWidth: 0, 
            }
        })
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
        height: 40,
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 10,
        ...Platform.select({
            web: {
                outlineStyle: 'none', 
                paddingTop: 0,
            },
        }),
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
                backgroundColor: '#C0C0C0',
                borderColor: '#fff',
                outlineStyle: 'none',
            },
        }),
    },
    inputLabel: {
        fontSize: 14,
        color: '#692367',
        marginTop: 10,
        marginBottom: 5,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
    },
    webDateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    webInput: {
        width: '48%',
        height: 40,
        fontSize: 16,
        paddingHorizontal: 10,
        borderColor: '#ddd',
        borderRadius: 4,
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
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
    inputWeb: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
        borderColor: '#fff',
        outlineStyle: 'none',
    },
};

export default AddOxygen;
