import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import styles from './styles';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase/config"
import { getDatabase, ref, set } from "firebase/database";
import Toast from '../../components/Toast/Toast';

const RegisterScreen = (props) => {

  const { navigation, route } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [phone,setPhone] =useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 1000);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length > 0 && password.length <= 30;
  };
  const isPhoneNumberValid = (phoneNumber) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleRegister = async () => {
    if (!isEmailValid(email) || !isPasswordValid(password) || !isPhoneNumberValid(phone)) {
      showToast("Invalid Email / Password format / Phone Number format", 'error');
      return;
    }
    try {
      let response = await createUserWithEmailAndPassword(auth, email, password);
      writeUserData(response.user.uid,response.user.email, password,phone)
      navigation.navigate("Login"); 
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const writeUserData = (userId, email, password,phone) => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + userId);
    set(userRef, {
        id:userId,
        username:"",
        email :email,
        password : password,
        first_name :"",
        last_name :"",
        display_name :"",
        shipping_address :[],
        phone_number :phone,
        account_creation_date :new Date().toDateString()
      });
  }
  return (
    <View style={styles.container}>
    {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            maxLength={30}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter Phone Number"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.input}
            maxLength={10}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
            maxLength={30}
          />

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text>Register</Text>
          </TouchableOpacity>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
            />
          )}
        </View>)}
    </View>
  );
};

export default RegisterScreen;
