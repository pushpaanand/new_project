import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home1';
import HealthProfile from '../screens/HealthProfile';
import Vitals from '../screens/Vitals';
import Visits from '../screens/Visits';
import Teleconsultation from '../screens/Teleconsultation';
import Settings from '../screens/Settings';
import Otp from '../screens/Otp';
import HealthCondition from '../screens/HealthConditions';
import Login from '../screens/Login';
import Menu from '../screens/Menu';
import Vaccination from '../screens/Vaccination';
import Allergies from '../screens/Allergies';
import FamilyMedicalHistory from '../screens/FamilyMedicalHistory';
import Pressure from '../screens/Pressure';
import BMI from '../screens/BMI';
import Sugar from '../screens/Sugar';
import Oxygen from '../screens/Oxygen';
import Pulse from '../screens/Pulse';
import AddVaccination from '../Add/AddVaccination';
import AddAllergy from '../Add/AddAllergies';
import AddFamilyHistory from '../Add/AddFamilyHistory';
import AddPressure from '../Add/AddPressure';
import AddSugar from '../Add/AddSugar';
import AddOxygen from '../Add/AddOxygen';
import AddPulse from '../Add/AddPulse';
import DoctorList from '../screens/DoctorList';
import DoctorDetails from '../screens/DoctorDetails';
import DoctorAvailability from '../screens/DoctorAvailability';
import Profile from '../screens/Profile';
import ViewConsultation from '../screens/ViewConsultation';
import Review from '../screens/Review';
import SecurityLock from '../screens/SecurityLock';
import UpdateVaccination from '../Add/UpdateVaccination';

// Create Tab Navigator and Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
function MainTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="security" component={SecurityLock} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={HomeStack} options={{ headerShown: false }} />
      <Stack.Screen name="Teleconsultation" component={Teleconsultation} options={{ headerShown: false }} />
      <Stack.Screen name="HealthCondition" component={HealthCondition} options={{ headerShown: false }} />
      <Stack.Screen name="vaccination" component={Vaccination} options={{ headerShown: false }} />
      <Stack.Screen name="allergies" component={Allergies} options={{ headerShown: false }} />
      <Stack.Screen name="family" component={FamilyMedicalHistory} options={{ headerShown: false }} />
      <Stack.Screen name="pressure" component={Pressure} options={{ headerShown: false }} />
      <Stack.Screen name="bmi" component={BMI} options={{headerShown: false}} />
      <Stack.Screen name="sugar" component={Sugar} options={{headerShown: false}} />
      <Stack.Screen name="oxygen" component={Oxygen} options={{headerShown: false}} />
      <Stack.Screen name="pulse" component={Pulse} options={{headerShown: false}} />
      <Stack.Screen name="addvaccination" component={AddVaccination} options={{headerShown: false}} />
      <Stack.Screen name="addallergy" component={AddAllergy} options={{headerShown: false}} />
      <Stack.Screen name="addfamily" component={AddFamilyHistory} options={{headerShown: false}} />
      <Stack.Screen name="addpressure" component={AddPressure} options={{headerShown: false}} />
      <Stack.Screen name="addsugar" component={AddSugar} options={{headerShown: false}} />
      <Stack.Screen name="addoxygen" component={AddOxygen} options={{headerShown: false}} />
      <Stack.Screen name="addpulse" component={AddPulse} options={{headerShown: false}} />
      <Stack.Screen name="list" component={DoctorList} options={{headerShown: false}} />
      <Stack.Screen name="details" component={DoctorDetails} options={{headerShown: false}} />
      <Stack.Screen name="avail" component={DoctorAvailability} options={{headerShown: false}} />
      <Stack.Screen name="profile" component={Profile} options={{headerShown: false}} />
      <Stack.Screen name="viewconsult" component={ViewConsultation} options={{headerShown: false}} />
      <Stack.Screen name="review" component={Review} options={{headerShown: false}} />
      <Stack.Screen name="updatevaccine" component={UpdateVaccination} options={{headerShown: false}} />      
    </Stack.Navigator>
  );
}

// Tab Navigator with Icons
const HomeStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Health Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Vitals') iconName = focused ? 'pulse' : 'pulse';
          else if (route.name === 'Visits') iconName = focused ? 'business' : 'business';
          else if (route.name === 'Teleconsultation') iconName = focused ? 'call' : 'call-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#692367',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Health Profile" component={Menu} options={{ headerShown: false }} />
      <Tab.Screen name="Vitals" component={Vitals} options={{ headerShown: false }} />
      <Tab.Screen name="Visits" component={Visits} options={{ headerShown: false }} />
      <Tab.Screen name="Teleconsultation" component={Teleconsultation} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
