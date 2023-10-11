import { StyleSheet , Dimensions} from 'react-native';
const { width: viewportWidth,height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    image: {
      width: 80,
      height: 80,
      marginRight: 16,
    },
    itemDetails: {
      flex: 3,
    },
    itemName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    itemPrice: {
      fontSize: 14,
      color: "#888",
    },
    itemQuantity: {
      fontSize: 14,
    },
    removeButton: {
      backgroundColor: "black",
      padding: 8,
      borderRadius: 5,
    },
    removeButtonText: {
      color: "white",
    },
    btncontainer: {
    
      height: 50,
      margin:30,
      borderRadius: 100,
      borderColor: '#2cd18a',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btntext: {
      fontSize: 14,
      color: '#2cd18a'
    },
    summaryContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      margin: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    summaryHeading: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    summaryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    summaryTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      paddingTop: 8,
    },
    ActivityLoaderCont:{
      flex: 1,
      justifyContent: 'center',
    },
    reviewButton:{
      flex:1,
      borderWidth: 1,
      borderRadius: 8,
      padding:5,
      borderColor:'black',
    },
    reviewButtonText:{
      fontSize:8
    },
    reviewcontainer: {
      flex: 1,
      padding: 16,
      backgroundColor:'white',
      height:height,
      alignContent:'center'
    },
    productImage: {
      width: 100,
      height: 100,
      marginBottom: 16,
    },
    ratingLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    reviewLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    reviewInput: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
      height:100
    },
    saveButton: {
      backgroundColor: 'black',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default styles;