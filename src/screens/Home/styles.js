import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width < height ? width : height;

const productNumColumns = 2;
const PRODUCT_ITEM_HEIGHT = 200; 
const PRODUCT_ITEM_MARGIN = 10;

const styles = StyleSheet.create({
  logoContainer:{ 
    flex: 1,
    justifyContent: 'center',
    width: 100,
    height: 100
  },
  logo:{
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%', 
    resizeMode: 'contain', 
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  productcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: PRODUCT_ITEM_MARGIN,
    width: (SCREEN_WIDTH - 30 - (productNumColumns * PRODUCT_ITEM_MARGIN / 2)) / productNumColumns, // Adjust width calculation
    height: PRODUCT_ITEM_HEIGHT + 75,
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15,
  },
  photo: {
    width: '100%',
    height: PRODUCT_ITEM_HEIGHT,
    borderRadius: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight:20,
    tintColor: 'grey',
  },
  searchInput: {
    backgroundColor: "white",
    color: "black",
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  productPrice: {
    color: "#713c11",
  },
  iconContainer:{
    flexDirection: "row", // Arrange items horizontally
    marginRight: 10,
    width:60,
    justifyContent:'space-between'
  },
  cartItemCount: {
    position: "absolute",
    top: -10, // Adjust this value to position the count properly
    right: 30, // Adjust this value to position the count properly
    backgroundColor: "red",
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  cartItemCountText: {
    color: "white",
    fontSize: 12,
  },
  noProductsMessageContainer: {
     justifyContent: "center",
     alignItems: "center",
  },
  noProductsMessage: {
    fontSize: 18,
    color: "gray",
  },
  loaderContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
