import { StyleSheet, Dimensions } from 'react-native';
const { width: viewportWidth,height } = Dimensions.get('window');

const styles = StyleSheet.create({
  maincontainer: {
    height: height,
    flexDirection: 'column',
    backgroundColor:"white"
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  storescontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
  },
  option: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    width:'80%',
  },
  selectedTab: {
    borderColor: 'green',
  },
  selectedOption: {
    backgroundColor: 'black',
  },
  optionText: {
    color:'black',
    fontWeight: 'bold',
  },
  selectedOptionText:{
    color:'black',
    fontWeight: 'bold',
  },
  selectedAddressOptionText:{
    color:'white',
    fontWeight: 'bold',
  },

  section: {
    flex: 1,
    padding: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent:"flex-start"
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  addressOption: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addressOptionText: {
    color: 'black',
    fontWeight: 'bold',
  },
  addAddressButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addAddressButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  storeOption: {
    display:'flex',
   alignItems:'flex-start'
  },
  storeOptionText: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedStoreOptionText:{
    color:'white',
    fontWeight: 'bold',
  },
  paymentButton:{
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentOption:{
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  paymentOptionText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'black', // Change the background color as desired
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white', // Change the text color as desired
    fontSize: 18,
    fontWeight: 'bold',
  }


  });

  export default styles;