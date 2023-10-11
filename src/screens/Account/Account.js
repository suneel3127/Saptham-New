import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import MenuImage from "../../components/MenuImage/MenuImage";
import { onAuthStateChanged , signOut} from "firebase/auth";
import {auth} from "../../firebase/config"
import { getDatabase, ref, set, get } from "firebase/database";
import AddressForm from '../Address/AddressForm';
import BackButton from "../../components/BackButton/BackButton";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping';




const AccountScreen = (props) => {
  const { navigation,route } = props;
  const [user,setUser] = useState({});
  const refreshKey = route.params?.key;
  const db = getDatabase();
  const userRef = ref(db, 'users/' + user?.id); 

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        
        if (firebaseUser) {
          const userId = firebaseUser.uid;
          const db = getDatabase();
          const userRef = ref(db, 'users/' + userId);
          
          try {
            const snapshot = await get(userRef);  
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setUser(null);
        }
      });
    };
    fetchUserData();
  }, [refreshKey]);

  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const navigateToLogin = () =>{
    navigation.navigate("Login"); 
  }

  const handleAccountDetailsPress = () => {
    navigation.navigate('Account Details',{user})
  };

  const handleOrdersPress = () => {
    navigation.navigate('Orders Details',{user})
  };

  const handleAddressesPress = () => {
    navigation.navigate('Address Details',{user})
  };

  const handleLogoutPress = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  

  const renderLogoutButton = () => {
    return (
      <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    );
  };

  if (user == null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity  style={styles.loginButton}>
          <Text onPress={navigateToLogin} style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.maincontainer}>
      <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleAccountDetailsPress}
        style={styles.sectionHeader}
      > 
        <FontAwesomeIcon icon={faUser} style={{ marginRight:20 }}/>
        <Text style={styles.sectionHeaderText}>Profile</Text>
        <FontAwesomeIcon icon={faAngleRight}  size={18}
            color="black"
            style={{ marginRight: 8 }}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddressesPress} style={styles.sectionHeader}>
      <FontAwesomeIcon icon={faLocationDot} style={{ marginRight:20 }}/>
        <Text style={styles.sectionHeaderText}>Addresses</Text>
        <FontAwesomeIcon icon={faAngleRight}  size={18}
            color="black"
            style={{ marginRight: 8 }}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleOrdersPress} style={styles.sectionHeader}>
      <FontAwesomeIcon icon={faCartShopping} style={{ marginRight:20 }}/>
        <Text style={styles.sectionHeaderText}>Orders</Text>
        <FontAwesomeIcon icon={faAngleRight} size={18}
            color="black"
            style={{ marginRight: 8 }}/>
        
      </TouchableOpacity>
      </ScrollView>
      {renderLogoutButton()}
    </View>
  );
};

export default AccountScreen;
