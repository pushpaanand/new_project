import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function AddAllergy() {
    const [allergy, setAllergy] = useState('');
    const [triggeredby, setTriggeredBy] = useState('');
    const [reaction, setReaction] = useState('');
    const [diagnosedon, setDiagnosedon] = useState(new Date());
    const [howoccur, setHowoccur] = useState();
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isFocused, setIsFocused] = useState({
        allergy: false,
        triggeredby: false,
        reaction: false,
        howoccur: false,
        notes: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
    const navigation = useNavigation();

    const renderInputField = (field, label, value, setValue) => (
        <View>
        <View style={[styles.inputContainer, isFocused[field] && styles.focusedInput]}>
            <Text style={[styles.floatingLabel, isFocused[field] || value ? styles.labelFocused : {}]}>
                {label}
            </Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
                }}
                onFocus={() => setIsFocused((prevState) => ({ ...prevState, [field]: true }))}
                onBlur={() => setIsFocused((prevState) => ({ ...prevState, [field]: false }))}
                placeholder={''}
                placeholderTextColor="#692367"
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
             </View>
            
       
        </View>
    );

    const handleDateConfirm = (date) => {
        setDiagnosedon(date);
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
        const newErrors = {};
        if (!allergy) newErrors.allergy = 'Allergy is required';
        if (!triggeredby) newErrors.triggeredby = 'Allergy Triggered by is required';
        if (!reaction) newErrors.reaction = 'Allergy Reaction is required';
        if (!diagnosedon) newErrors.diagnosedon = 'Allergy First diagnosed on is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false); 
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigation.navigate('allergies', { message: 'Allergy added successfully!' });
                setShowSuccessMessage(false);  
            }, 2000); 
        }, 2000); 
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.container1}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#692367" />
                </TouchableOpacity>

                <Text style={styles.title}>Add Allergy</Text>

                <View style={styles.separatorLine} />
                
                {renderInputField('allergy', 'Allergy *', allergy, setAllergy)}
                {renderInputField('triggeredby', 'Triggered By *', triggeredby, setTriggeredBy)}
                {renderInputField('reaction', 'Reaction *', reaction, setReaction)}

                <View style={styles.inputContainer}>
                    <Text style={[styles.floatingLabel, isFocused.diagnosedon || diagnosedon ? styles.labelFocused : {}]}>
                        First diagnosed on *
                    </Text>
                    {/* <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: '#000' }}>
                            {diagnosedon ? diagnosedon.toLocaleDateString() : 'Select Date'}
                        </Text>
                    </TouchableOpacity>
                    
                </View>

                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setShowDatePicker(false)}
                    date={diagnosedon}
                /> */}
                {Platform.OS === 'web' ? (
                            <input
                                type="date"
                                style={styles.input1}
                                value={diagnosedon.toISOString().split('T')[0]} // Format to YYYY-MM-DD
                                onChange={(e) => setNextVaccinationDate(new Date(e.target.value))}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={{ color: '#000' }}>
                                    {diagnosedon ? diagnosedon.toLocaleDateString() : 'Select Date'}
                                </Text>
                            </TouchableOpacity>


                        )}

                        <DateTimePickerModal
                            isVisible={showDatePicker}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={() => setShowDatePicker(false)}
                            date={diagnosedon}
                        />
                        </View>

                {renderInputField('notes', 'Notes', notes, setNotes)}

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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginLeft: 10,
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
});
