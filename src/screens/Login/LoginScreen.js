import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Toast from '../../components/Toast/Toast';

const LoginScreen = (props) => {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.goBack();
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
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

  const handleLogin = async () => {
    if (!isEmailValid(email) || !isPasswordValid(password)) {
      showToast("Invalid Email / Password format", 'error');
      return;
    }
    try {
      setIsLoading(true);
      let user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setIsLoading(false);
      showToast("Invalid Email / Password", 'error'); // Use 'error' type for error messages
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

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

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
            maxLength={30}
          />

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text>Register</Text>
          </TouchableOpacity>

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
