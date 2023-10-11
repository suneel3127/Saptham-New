import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import styles from './styles';
import { getDatabase, ref, set, get } from "firebase/database";
import BackButton from "../../components/BackButton/BackButton";
import Toast from '../../components/Toast/Toast';

const AccountDetails = (props) => {
  const { navigation,route } = props;
  const [user,setUser] =  useState(route.params?.user);
  const db = getDatabase();
  const userRef = ref(db, 'users/' + user?.id); 
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.navigate("Account", { key: Math.random() }); 
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
    setTimeout(() => {
        setToast(null);
      }, 1000);
  };
  
  const handleSaveAccountDetails = () => {
    setIsLoading(true)
    set(userRef, user)
      .then(() => {
        setIsLoading(false)
        showToast('User details updated successfully!','success');
        setUser(user);
      })
      .catch((error) => {
        setIsLoading(false)
        showToast('Error updating user details:', 'error');
      });
  };

  const renderAccountDetails = () => {
    return (
        <View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name:</Text>
          <TextInput
            style={styles.inputField}
            value={user.first_name}
            onChangeText={(text) => setUser({ ...user, first_name: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name:</Text>
          <TextInput
            style={styles.inputField}
            value={user.last_name}
            onChangeText={(text) => setUser({ ...user, last_name: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput
            style={styles.inputField}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
        </View>
        
      </View>
    );
  };
  
  return (
    <View style={styles.maincontainer}>
      {renderAccountDetails()}
      <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAccountDetails}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
     {
        isLoading?
          <ActivityIndicator />:null 
        }
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
    </View>
  );
};

export default AccountDetails;
