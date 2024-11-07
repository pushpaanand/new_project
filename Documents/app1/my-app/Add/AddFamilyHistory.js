import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

export default function AddFamilyHistory() {
    const [relation, setRelation] = useState('');
    const [healthCondition, setHealthCondition] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();

    const [isFocused, setIsFocused] = useState({
        healthCondition: false,

    });

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSave = () => {
        const newErrors = {};
        if (!relation) newErrors.allergy = 'Please select family relation';
        if (Object.keys(newErrors).length > 0) {
            // setErrors(newErrors);
            setShowSuccessMessage('Please select family relation');
            return;
        }

        if (checked) {
            // Clear the form data
            setRelation('');
            setHealthCondition('');
            setChecked(false);

            // Show success message
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShowSuccessMessage("New Family Medical History saved successfully");
                setTimeout(() => {
                    setShowSuccessMessage('');
                }, 2000);
            }, 2000);
        } else {
            // navigation.goBack();
            navigation.navigate('family', { message: 'New Family Medical History saved successfully' });
        }
    };

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
                multiline
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#692367" />
            </TouchableOpacity>

            <Text style={styles.title}>Add Family History</Text>

            <View style={styles.separatorLine} />

            <View style={styles.inputContainer}>
                <Text style={[styles.floatingLabel, relation ? styles.labelFocused : {}]}>Select a family relation: *</Text>
                {/* <View style={styles.pickerContainer}> */}
                <Picker
                    selectedValue={relation}
                    onValueChange={(itemValue) => setRelation(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Father" value="father" />
                    <Picker.Item label="Mother" value="mother" />
                    <Picker.Item label="Sibling" value="sibling" />
                    <Picker.Item label="Grandparent" value="grandparent" />
                </Picker>
            </View>

            {/* <Text style={styles.label}>Describe Health Condition of family member *</Text> */}
            {renderInputField('healthcondition', 'Describe Health Condition of family member *', healthCondition, setHealthCondition)}
            {/* <TextInput
                style={styles.input}
                placeholder="Describe Health Condition of family member"
                value={healthCondition}
                onChangeText={setHealthCondition}
                multiline
            /> */}

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!checked)}
                    color="#800080"
                />
                <Text style={styles.checkboxLabel}>Add More</Text>
            </View>
            {showSuccessMessage &&
                <View style={styles.messageContainer}>                    
                    <Text style={styles.messageText}>{showSuccessMessage}</Text>
                </View>
            }
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            {loading && (
                <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                </BlurView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
    label: {
        fontSize: 16,
        color: '#692367',
        marginBottom: 8,
    },
    // pickerContainer: {
    //     borderWidth: 1,
    //     borderColor: '#692367',
    //     borderRadius: 8,
    //     marginBottom: 16,
    // },
    // picker: {
    //     height: 40,
    // },
    // input: {
    //     borderWidth: 1,
    //     borderColor: '#692367',
    //     borderRadius: 8,
    //     padding: 8,
    //     height: 80,
    //     marginBottom: 16,
    //     textAlignVertical: 'top', // For multiline alignment
    // },
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxLabel: {
        color: '#692367',
        fontSize: 16,
    },
    messageContainer: {
        backgroundColor: '#A9A9A9',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 'auto',
        marginBottom: 16,
        alignItems: 'center',
    },
    messageText: {
        color: '#FFFFFF',
    },
    buttonContainer: {
        flex: 1,
        marginBottom: 0
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
