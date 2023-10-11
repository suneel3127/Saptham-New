import { StyleSheet, Dimensions } from 'react-native';
const { width: viewportWidth,height } = Dimensions.get('window');

const styles = StyleSheet.create({
  maincontainer:{
    flex:1,
    height:height,
    padding: 16,
    backgroundColor:"white",
    justifyContent:'space-between'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex:4
  },
  section: {
    padding: 16,
    height:height-60,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  addAddressButton: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  addAddressButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    marginBottom: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  addressOption: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection:'row'
  },
  addressOptionText: {
    color: 'black',
    fontWeight: 'bold',
  },
  
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    overflow: 'hidden',
  },
  orderDetailsLeft: {
    fontSize: 10,
    color: '#555',
  },
  orderDetailsRight: {
    fontSize: 12,
  },
  leftOrderContainer: {
    flex: 1,
  },
  rightOrderContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent:'space-around'
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  pendingStatus:{
    backgroundColor: 'orange',
    color: 'white',
    padding:5
  },
  failedStatus:{
    backgroundColor: '#cc0000',
    color: 'white',
    padding:5
  },
  orderedStatus: {
    backgroundColor: 'black',
    color: 'white',
    padding:5
  },
  deliveredStatus: {
    backgroundColor: 'green',
    color: 'white',
    padding: 5,
  },
  addressButtons: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent:'space-around',
    flexDirection: 'row',
  },
  iconButton: {
    fontSize:8,
    marginLeft:10
  },
  leftContainer:{
    flex:4
  }
});

export default styles;
