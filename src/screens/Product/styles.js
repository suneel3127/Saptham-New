import { width } from '@fortawesome/free-solid-svg-icons/faCartShopping';
import { StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth,height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop:20
  },
  carouselContainer: {
    backgroundColor: 'white', // Add your desired background color
    marginVertical: 10, 
  },
  carousel: {
    flex: 1, 
    
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%', // Use '100%' to fit the entire image without cropping
    resizeMode: 'contain', 
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 250
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 200
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0
  },
  infoProductContainer: {
    flex: 1,
    margin: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0
  },
  infoProduct: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2cd18a'
  },
  infoDescriptionProduct: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 10,
    margin: 15
  },
  infoProductName: {
    fontSize: 28,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  btncontainer: {
    flex: 1,
    height: 50,
    width: 270,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100,
    borderColor: '#2cd18a',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: '#2cd18a'
  },
  btntext: {
    fontSize: 14,
    color: '#2cd18a'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  quantityValue: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  carticoncontainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  iconbutton: {
    backgroundColor: "blue",
    padding: 16,
    borderRadius: 30,
    elevation: 5, 
  },
  reviewContainer: {
    flex:1,
    margin: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  reviewerName: {
    fontWeight: "bold",
    marginTop: 5,
  },
  rating: {
    marginTop: 5,
    color: "#ff9800",
  },
  reviewText: {
    marginTop: 5,
  },
  reviewsContainer: {
    width:viewportWidth,
    marginBottom: 40,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer:{
    flexDirection: "row", // Arrange items horizontally
    marginRight: 10,
    width:60,
    justifyContent:'flex-end'
  }

  
});

export default styles;
