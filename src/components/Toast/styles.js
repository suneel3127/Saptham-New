import { StyleSheet } from "react-native";
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
    backgroundColor: 'blue',
  },
  toastText: {
    color: 'white',
  },
});