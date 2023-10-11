import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, FlatList,Alert } from 'react-native';
import styles from './styles';
import { getDatabase, ref, set, get } from "firebase/database";
import AddressForm from '../Address/AddressForm';
import BackButton from "../../components/BackButton/BackButton";
import Toast from '../../components/Toast/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';




const AddressScreen = (props) => {
  const { navigation,route } = props;
  const [user,setUser] =  useState(route.params?.user);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const db = getDatabase();
  const userRef = ref(db, 'users/' + user?.id); 
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editAddress,setEditAddress] = useState(null);
  const [editId,setEditId]=useState(null)
  
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
  
  const handleAddNewAddress = () => {
    setAddressModalVisible(true);
  };

  const saveAddress = (address, addressObj) =>{
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000); // Adjust as needed
    const addressId=  `${timestamp}-${randomNum}`;
    const newAddress = {
      id: addressId,
      address: address,
      addressObj:addressObj
    };
    const updatedShippingAddress = user.shipping_address
      ? [...user.shipping_address, newAddress]
      : [newAddress];
    const updatedUser = { ...user, shipping_address: updatedShippingAddress };
    set(userRef, updatedUser)
      .then(() => {
        showToast('User details updated successfully!','success');
        setUser(updatedUser);
      })
      .catch((error) => {
        showToast('Error updating user details:', 'error');
      });
  }
  const editExistingAddress = (address, addressObj, addressId) =>{
    const updatedShippingAddress = [...user.shipping_address];
    const addressIndex = updatedShippingAddress.findIndex(
      (address) => address.id === addressId
    );
    if (addressIndex !== -1) {
      updatedShippingAddress[addressIndex] = {
        id: addressId,
        address: address,
        addressObj: addressObj, 
      };
      const updatedUser = { ...user, shipping_address: updatedShippingAddress };
      set(userRef, updatedUser)
        .then(() => {
          showToast('Address updated successfully!', 'success');
          setUser(updatedUser);
        })
        .catch((error) => {
          showToast('Error updating address:', 'error');
        });
    } else {
      showToast('Address not found for editing.', 'error');
    }
    setEditAddress(null);
    setEditId(null);
  }
  const deleteAddress = (addressId) => {
    const updatedShippingAddress = user.shipping_address.filter(
      (address) => address.id !== addressId
    );
    const updatedUser = { ...user, shipping_address: updatedShippingAddress };
    set(userRef, updatedUser)
      .then(() => {
        showToast('Address deleted successfully!', 'success', 2000);
        setUser(updatedUser);
      })
      .catch((error) => {
        showToast('Error deleting address:', 'error', 2000);
      });
  };

  

  const renderAddresses = () => {
    
    const addresses = user.shipping_address;

    return (
      <View >
        
        {addresses?.length > 0 ? (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item,index }) => (
              <View style={styles.addressOption}>
                <View style={styles.leftContainer}>
                <Text style={styles.addressOptionText}>{item.address}</Text>
                </View>
                <View style={styles.addressButtons}>
                                <TouchableOpacity
                                  
                                  onPress={() => {
                                    setAddressModalVisible(true);
                                    setEditAddress(item.addressObj);
                                    setEditId(item.id)
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPen} style={styles.iconButton}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    Alert.alert(
                                      'Delete Address',
                                  'Are you sure you want to delete this address?',
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Delete',
                                      style: 'destructive',
                                      onPress: () => deleteAddress(item.id),
                                    },
                                  ]
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} style={styles.iconButton}/>
                            </TouchableOpacity>
                      </View>
              </View>
            )}
          />
        ) : (
          <Text>No addresses found.</Text>
        )}
        
      </View>
    );
  };

  
  return (
    <View style={styles.maincontainer}>
      
      {renderAddresses()}
      <TouchableOpacity
          onPress={() => handleAddNewAddress()}
          style={styles.addAddressButton}
        >
          <Text style={styles.addAddressButtonText} >Add Address</Text>
        </TouchableOpacity>
      <AddressForm
                isVisible={isAddressModalVisible}
                onClose={() =>{ setAddressModalVisible(false);setEditAddress(null);
                setEditId(null);}}
                onSaveAddress={(newAddress,addressObj) => {
                  if(editId !== null){
                    editExistingAddress(newAddress, addressObj,editId)
                  }else{
                  saveAddress(newAddress, addressObj);
                  }
                  setAddressModalVisible(false);
                }}
                editAddress={editAddress}
            />  
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

export default AddressScreen;
