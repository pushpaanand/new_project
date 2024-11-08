import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';

export default function UpdateVaccination({ route }) {
    const { item } = route.params; // Get the item passed from the table row click
    const [vaccinationFor, setVaccinationFor] = useState(item.vaccinationFor || '');
    const [vaccineDetail, setVaccineDetail] = useState(item.vaccineDetail || '');
    const [takenOn, setTakenOn] = useState(item.takenOn || '');
    const [lotNumber, setLotNumber] = useState(item.lotNumber || '');
    const [nextVaccinationDate, setNextVaccinationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState(item.notes || '');
    const [fileName, setFileName] = useState(item.fileName || 'No file chosen');
    const [isFocused, setIsFocused] = useState({});
    const [loading, setLoading] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
    const navigation = useNavigation();

    useEffect(() => {
        setVaccinationFor(item.vaccinationFor);
        setVaccineDetail(item.vaccineDetail);
        setTakenOn(item.takenOn);
        setLotNumber(item.lotNumber);
        // setNextVaccinationDate(new Date());
        setNotes(item.notes);
        setFileName(item.fileName || 'No file chosen');
    }, [item]);

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

    const handleFileUpload = async () => {
        const result1 = await DocumentPicker.getDocumentAsync({});
        const result=result1.assets;
        console.log('rrrrr', result);
        if (result) {
            setFileName(result[0].name);
        }
    };

    const handleSave = () => {
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 
            setShowSuccessMessage(true);
            setTimeout(() => {                
                navigation.goBack();  // Or navigate to the vaccination list page if needed
                setShowSuccessMessage(false);  
            }, 2000); 
        }, 2000); 
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#692367" />
                </TouchableOpacity>

                <Text style={styles.title}>Edit Vaccination</Text>

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

                {renderInputField('lotNumber', 'Lot Number', lotNumber, setLotNumber)}

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

                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setShowDatePicker(false)}
                    date={nextVaccinationDate}
                />

                {renderInputField('notes', 'Notes', notes, setNotes)}

                <Text style={styles.label}>Report File</Text>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <TouchableOpacity style={styles.fileUpload} onPress={handleFileUpload}>
                        <Text>{fileName}</Text>
                    </TouchableOpacity>
                    <Ionicons name="cloud-upload-outline" size={32} color="black" onPress={handleFileUpload}/>
                </View>

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
