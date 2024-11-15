import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    console.log('fff', fileName);
    const handleFileUpload = async () => {
        const result1 = await DocumentPicker.getDocumentAsync({});
        const result = result1.assets;
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
                // navigation.goBack();
                navigation.navigate('vaccination', { message: 'Vaccination added successfully!' });
                setShowSuccessMessage(false);
            }, 2000);
        }, 2000);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.container1}>
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

                        <RNPickerSelect
                            onValueChange={(value) => setVaccinationFor(value)}
                            items={[
                                { label: 'COVID-19', value: 'covid' },
                                { label: 'Flu', value: 'flu' },
                                { label: 'Hepatitis B', value: 'hepatitis_b' },
                            ]}
                            placeholder={{ label: 'Vaccine Name *', value: '' }}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                        />
                        {/* )} */}
                    </View>
                    {renderInputField('vaccinationfor', 'Vaccination For', vaccinationFor, setVaccinationFor)}
                    {/* Taken On Field */}
                    {renderInputField('takenOn', 'Taken On *', takenOn, setTakenOn)}
                    <View style={styles.inputContainer}>
                        <Text style={[styles.floatingLabel, vaccineDetail ? styles.labelFocused : {}]}>
                            Vaccine Details *
                        </Text>
                        {/* {Platform.OS === 'web' ? (
                        <select
                            value={range}
                            onChange={(e) => handleRangeChange(e.target.value)}
                            style={styles.webPicker}
                        >
                            <option value="select">Select</option>
                            <option value="covid">COVID-19</option>
                            <option value="flu">Flu</option>
                        </select>
                    ) : (
                        <RNPicker
                            selectedValue={vaccineDetail}
                            onValueChange={(itemValue) => setVaccineDetail(itemValue)}
                            style={styles.picker}>
                            <RNPicker.Item label="" value="" />
                            <RNPicker.Item label="COVID-19" value="covid" />
                            <RNPicker.Item label="Flu" value="flu" />
                            <RNPicker.Item label="Hepatitis B" value="hepatitis_b" />
                        </RNPicker>
                    )} */}
                        <RNPickerSelect
                            onValueChange={(value) => setVaccineDetail(value)}
                            items={[
                                { label: 'COVID-19', value: 'covid' },
                                { label: 'Flu', value: 'flu' },
                                { label: 'Hepatitis B', value: 'hepatitis_b' },
                            ]}
                            placeholder={{ label: 'Vaccine Details *', value: '' }}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>

                    {/* Lot Number Field */}
                    {renderInputField('lotNumber', 'Lot Number', lotNumber, setLotNumber)}

                    {/* Next Vaccination Date Field */}
                    <View style={styles.inputContainer}>

                        <Text style={[styles.floatingLabel, isFocused.nextVaccinationDate || nextVaccinationDate ? styles.labelFocused : {}]}>
                            Next Vaccination Date
                        </Text>
                        {Platform.OS === 'web' ? (
                            <input
                                type="date"
                                style={styles.input1}
                                value={nextVaccinationDate.toISOString().split('T')[0]} // Format to YYYY-MM-DD
                                onChange={(e) => setNextVaccinationDate(new Date(e.target.value))}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={{ color: '#000' }}>
                                    {nextVaccinationDate ? nextVaccinationDate.toLocaleDateString() : 'Select Date'}
                                </Text>
                            </TouchableOpacity>


                        )}

                        <DateTimePickerModal
                            isVisible={showDatePicker}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={() => setShowDatePicker(false)}
                            date={nextVaccinationDate}
                        />

                    </View>
                    {/* Notes Field */}
                    {renderInputField('notes', 'Notes', notes, setNotes)}

                    {/* File Upload */}
                    <Text style={styles.label}>Report File</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.fileUpload} onPress={handleFileUpload}>
                            <Text>{fileName}</Text>
                        </TouchableOpacity>
                        <Ionicons name="cloud-upload-outline" size={32} color="black" onPress={handleFileUpload} />
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
        marginTop: 10,
        padding: wp('5%'),
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
        ...Platform.select({
            web: {
                boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
                borderWidth: 0,
            }
        })
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
    webPicker: {
        height: 40,
        color: '#692367',
        width: '100%',
        padding: 8,
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
                backgroundColor: '#fff',
                borderColor: '#fff',
                outlineStyle: 'none',
            },
        }),
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        paddingVertical: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#fff',
        borderColor: '#fff',
        outlineStyle: 'none',
    },
};
