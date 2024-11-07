import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';

export default function AddVaccination() {
    const [vaccinationFor, setVaccinationFor] = useState('');
    const [vaccineDetail, setVaccineDetail] = useState('');
    const [takenOn, setTakenOn] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [nextVaccinationDate, setNextVaccinationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState('');
    const [fileName, setFileName] = useState('No file chosen');
    const [isFocused, setIsFocused] = useState({
        vaccinationfor: false,
        takenOn: false,
        lotNumber: false,
        nextVaccinationDate: false,
        notes: false,
    });
    const [loading, setLoading] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
    const navigation = useNavigation();

    const renderInputField = (field, label, value, setValue) => (
        <View style={[styles.inputContainer, isFocused[field] && styles.focusedInput]}>
            <Text style={[styles.floatingLabel, isFocused[field] || value ? styles.labelFocused : {}]}>
                {label}
            </Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                onFocus={() => setIsFocused((prevState) => ({ ...prevState, [field]: true }))}
                onBlur={() => setIsFocused((prevState) => ({ ...prevState, [field]: false }))}
                placeholder={''}
                placeholderTextColor="#692367"
            />
        </View>
    );

    const handleDateConfirm = (date) => {
        setNextVaccinationDate(date);
        setShowDatePicker(false);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleFileUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (result.type === 'success') {
            setFileName(result.name);
        }
    };

    const handleSave = () => {
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 
            setShowSuccessMessage(true);
            setTimeout(() => {                
                // navigation.goBack();
                navigation.navigate('vaccination', { message: 'Vaccination added successfully!' });
                setShowSuccessMessage(false);  
            }, 2000); 
        }, 2000); 
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                {/* Vaccination For Dropdown */}
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#692367" />
                </TouchableOpacity>

                <Text style={styles.title}>Add Vaccination</Text>

                {/* Thick line below header */}
                <View style={styles.separatorLine} />
                <View style={styles.inputContainer}>
                    <Text style={[styles.floatingLabel, vaccinationFor ? styles.labelFocused : {}]}>
                        Vaccine Name *
                    </Text>
                    <Picker
                        selectedValue={vaccinationFor}
                        onValueChange={(itemValue) => setVaccinationFor(itemValue)}
                        style={styles.picker}>
                        <Picker.Item label="" value="" />
                        <Picker.Item label="COVID-19" value="covid" />
                        <Picker.Item label="Flu" value="flu" />
                        <Picker.Item label="Hepatitis B" value="hepatitis_b" />
                    </Picker>
                </View>
                {renderInputField('vaccinationfor', 'Vaccination For', vaccinationFor, setVaccinationFor)}
                {/* Taken On Field */}
                {renderInputField('takenOn', 'Taken On *', takenOn, setTakenOn)}
                <View style={styles.inputContainer}>
                    <Text style={[styles.floatingLabel, vaccineDetail ? styles.labelFocused : {}]}>
                        Vaccine Details *
                    </Text>
                    <Picker
                        selectedValue={vaccineDetail}
                        onValueChange={(itemValue) => setVaccineDetail(itemValue)}
                        style={styles.picker}>
                        <Picker.Item label="" value="" />
                        <Picker.Item label="COVID-19" value="covid" />
                        <Picker.Item label="Flu" value="flu" />
                        <Picker.Item label="Hepatitis B" value="hepatitis_b" />
                    </Picker>
                </View>

                {/* Lot Number Field */}
                {renderInputField('lotNumber', 'Lot Number', lotNumber, setLotNumber)}

                {/* Next Vaccination Date Field */}
                <View style={styles.inputContainer}>
                    <Text style={[styles.floatingLabel, isFocused.nextVaccinationDate || nextVaccinationDate ? styles.labelFocused : {}]}>
                        Next Vaccination Date
                    </Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: '#000' }}>
                            {nextVaccinationDate ? nextVaccinationDate.toLocaleDateString() : 'Select Date'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Date Picker Modal */}
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setShowDatePicker(false)}
                    date={nextVaccinationDate}
                />

                {/* Notes Field */}
                {renderInputField('notes', 'Notes', notes, setNotes)}

                {/* File Upload */}
                <Text style={styles.label}>Report File</Text>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <TouchableOpacity style={styles.fileUpload} onPress={handleFileUpload}>
                        <Text>{fileName}</Text>
                    </TouchableOpacity>
                    <Ionicons name="cloud-upload-outline" size={32} color="black" onPress={handleFileUpload}/>
                </View>
                <Text style={styles.fileDetails}>Max file size 5 MB. Supported formats: txt, doc, pdf, jpeg, ppt, xls, DICOM image files</Text>

                {/* Save Button */}
                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                {loading && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    </BlurView>
                )}
                {/* {showSuccessMessage && (
                    <View style={styles.successMessageContainer}>
                        <Text style={styles.successMessage}>Vaccination added successfully!</Text>
                    </View>
                )} */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    scrollContent: {
        padding: 0,
    },
    backButton: {
        position: 'absolute',
        top: 50, // Adjust based on your screen
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
        height: 5, // Thick line
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
    },
    label: {
        fontSize: 16,
        color: '#692367',
        marginBottom: 8,
    },
    picker: {
        height: 40,
        fontSize: 16,
        paddingHorizontal: 10,
        color: '#000',
    },
    input: {
        height: 40,
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 10,
    },
    focusedInput: {
        borderColor: '#692367',
    },
    floatingLabel: {
        position: 'absolute',
        left: 10,
        top: 18,
        fontSize: 16,
        color: '#666',
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },
    labelFocused: {
        top: -10,
        left: 10,
        fontSize: 12,
        color: '#692367',
    },
    fileUpload: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        width: '80%',
        borderRadius: 4,
        backgroundColor: '#ddc9de',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fileDetails: {
        fontSize: 12,
        color: '#888',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#692367',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a black shadow-like background
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
