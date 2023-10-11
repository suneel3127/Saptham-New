import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import styles from "./styles";
import Toast from '../../components/Toast/Toast';

const AddressForm = ({ isVisible, onClose, onSaveAddress ,editAddress}) => {
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (editAddress) {
      setName(editAddress.name || '');
      setStreetAddress(editAddress.streetAddress || '');
      setCity(editAddress.city || '');
      setState(editAddress.state || '');
      setCountry(editAddress.country || '');
      setPhoneNumber(editAddress.phoneNumber || '');
      setPinCode(editAddress.pinCode || '');
    }else{
      setName('');
      setStreetAddress('');
      setCity('');
      setState('');
      setCountry('');
      setPhoneNumber('');
      setPinCode('');
    }
  }, [editAddress]);

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
    setTimeout(() => {
        setToast(null);
      }, 1000);
  };


  const handleSaveAddress = () => {
    if (!name || !streetAddress || !city || !state || !country || !pinCode) {
      showToast( "All fields are required.", 'error');
      return;
    }
    if (!/^\d+$/.test(phoneNumber)) {
      showToast( "Phone number must contain only numbers.", 'error');
      return;
    }

    if (!/^\d+$/.test(pinCode)) {
      showToast( "Pin code must contain only numbers.", 'error');
      return;
    }
    const displayAddress = `${name},${streetAddress},${city},${state},${country},${pinCode}-${phoneNumber}`;
    const addressObj = {
      name:name,
      streetAddress:streetAddress,
      city:city,
      state:state,
      country:country,
      pinCode:pinCode,
      phoneNumber:phoneNumber
    }
    onSaveAddress(displayAddress, addressObj);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.addressFormContainer}>
              <Text style={styles.addressFormTitle}>Add New Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Name"
                onChangeText={(text) => setName(text)}
                value={name}
                maxLength={30}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="Phone Number"
                onChangeText={(text) => setPhoneNumber(text)}
                value={phoneNumber}
                maxLength={10}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="Street address"
                onChangeText={(text) => setStreetAddress(text)}
                value={streetAddress}
                maxLength={100}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="City"
                onChangeText={(text) => setCity(text)}
                value={city}
                maxLength={30}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="State"
                onChangeText={(text) => setState(text)}
                value={state}
                maxLength={30}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="Country"
                onChangeText={(text) => setCountry(text)}
                value={country}
                maxLength={30}
              />
              <TextInput
                style={styles.addressInput}
                placeholder="Pin Code"
                onChangeText={(text) => setPinCode(text)}
                value={pinCode}
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.saveAddressButton}
                onPress={handleSaveAddress}
              >
                <Text style={styles.saveAddressButtonText}>Save Address</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeAddressFormButton}
                onPress={onClose}
              >
                <Text style={styles.closeAddressFormButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
    </Modal>
  );
};

export default AddressForm;
