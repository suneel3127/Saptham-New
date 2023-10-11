import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';

const Toast = ({ message, type }) => {
  const [toastVisible, setToastVisible] = useState(true);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    show();
  }, []);

  const show = () => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setToastVisible(true);
    });
  };

  const hide = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setToastVisible(false);
    });
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={toastVisible}
      onRequestClose={() => setToastVisible(false)}
    >
      <View style={styles.container}>
        <View style={[styles.toast, type === 'error' ? styles.errorToast : styles.successToast]}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toast: {
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successToast: {
    backgroundColor: 'green',
  },
  errorToast: {
    backgroundColor: '#cc0000',
  },
  toastText: {
    color: 'white',
  },
});

export default Toast;
