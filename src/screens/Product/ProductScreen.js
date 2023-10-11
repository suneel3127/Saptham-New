import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {  ScrollView, Text, View,  Image,  Dimensions,  TouchableHighlight,  ActivityIndicator } from "react-native";
import styles from "./styles";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BackButton from "../../components/BackButton/BackButton";
import CartButton from "../../components/CartButton/CartButton";
import { addItemToCart, setVariants, setReviews, updateUserCart } from "../../redux/slice";
import { useDispatch,useSelector } from "react-redux";
import VariantSelectionScreen from "../VariantSelection/VariantSelectionScreen";
import HTML from "react-native-render-html";
import ReviewItem from "./ReviewItem";
import { getDatabase, ref, push, get ,set, query, equalTo} from "firebase/database";
import Toast from '../../components/Toast/Toast';
import StarRating from 'react-native-star-rating-widget'


const { width: viewportWidth } = Dimensions.get("window");

export default function ProductScreen(props) {

  const { navigation, route } = props;
  const dispatch = useDispatch();
  const item = route.params?.item;
  const db = getDatabase();
  const user = useSelector((app) => app.state.userDetails);
  const cartItemsAnonymous = useSelector((app) => app.state.cartItems);
  const screen = Dimensions.get('window');
  const contentWidth = screen.width;  
  const [activeSlide, setActiveSlide] = useState(0);
  const slider1Ref = useRef();
  const cartItems = useSelector((app) => app.state.cartItems);
  const [productReviews,setProductReviews] = useState([]);
  const [itemVariants, setItemVariants] = useState([]);
  const [isVariantSelectionVisible, setVariantSelectionVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);


  useEffect(()=>{
    setIsLoading(true);
    getProductVariantsSnap(item.id);
    getProductReviewsSnap(item.id);
  },[])
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <View style={styles.iconContainer}>
        <CartButton
        onPress={() => {
          navigation.navigate("Cart", { key: Math.random() });
        }}
      />
      </View>
      
      ),
    });
  }, []);

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
    setTimeout(() => {
        setToast(null);
      }, 1000);
  };
  
  const getProductVariantsSnap = async (parentProductId) =>{
    let productVariantsRef = ref(db, "ProductVariants")
    try {
      let variantSnapshot = await get(productVariantsRef); 
      if (variantSnapshot.exists()) {
        const allVariants = variantSnapshot.val();
        const variants = Object.values(allVariants).filter(
         (variant) => variant.parent_product_id === parentProductId
        );
        setItemVariants(variants);
        dispatch(setVariants(variants));
        setIsLoading(false);
       
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching Variants data:', error);
    }
  };
  const getProductReviewsSnap = async (productId) =>{
    let productReviewsRef = ref(db, "Reviews")
    try { 
      let reviewsSnapshot = await get(productReviewsRef);  
      if (reviewsSnapshot.exists()) {
        let allReviews = reviewsSnapshot.val();
        let reviews = Object.values(allReviews).filter(
          (review) => review.product_id === productId
         );
        setProductReviews(reviews);
        dispatch(setReviews(reviews));
        let totalRating = reviews.reduce((total, review) => total + review.rating, 0);
        let averageRating = totalRating / reviews.length;
        setRating(averageRating);
        setIsLoading(false);

      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching Reviews data:', error);
    }
  };
  const showVariantSelection = () => {
    setVariantSelectionVisible(true);
  };
  const onVariantSelectionClose =()=>{
    setVariantSelectionVisible(false);
  }
  const calculateAverageReview = ()=>{
    
  }

  const handleVariantSelectionDone = (selectedVariantName, selectedVariantQuantity, noOfItems) => {
    
    setIsLoading(true);
    const selectedVariant = itemVariants.filter((x) => x.variant_name === selectedVariantName && x.quantity == selectedVariantQuantity)[0];
    if(user == null){
      const itemIndex = cartItemsAnonymous.findIndex((x) => x.id === selectedVariant.id);
      if (itemIndex !== -1) {
        const updatedCartItem = { ...cartItemsAnonymous[itemIndex] };
        updatedCartItem.quantity += noOfItems;
        dispatch(addItemToCart(updatedCartItem));
      } else {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        const randomid=  `${timestamp}-${randomNum}`;
        const cartItem = { 
          id:selectedVariant.id,
          quantity: noOfItems,
          images:item.images,
          name:item.name,
          price:selectedVariant.price,
          variant_quantity:selectedVariant.quantity,
          variant_name:selectedVariant.variant_name
        };
        dispatch(addItemToCart(cartItem));
      }
      setIsLoading(false);
      showToast("Product added to cart", 'success');
    }else{
      addToCartInDatabase(user.id, selectedVariant.id, noOfItems , selectedVariant)
      .then((cartItemId) => {
        setIsLoading(false);
        showToast("Product added to cart", 'success');
      })
      .catch((error) => {
        setIsLoading(false);
        showToast("Error adding Product to cart", 'error');
      });
    }
    setVariantSelectionVisible(false);
    
  };

  
  const addToCartInDatabase = async (userId, variantId, noOfItems, selectedVariant) => {
    const existingCart = await findCartByUserId(userId);
    let cartItemId = null;
    let cart = null;
    if (existingCart) {
      cart= existingCart.id
       cartItemId = await addToExistingCart(existingCart.id, variantId, noOfItems, selectedVariant);
      
    } else {

      const cartId = await createNewCart(userId);
      cart = cartId
       cartItemId = await addToExistingCart(cartId, variantId, noOfItems, selectedVariant);
    }
    try{
    const cartItems = await findCartItemsBasedOnCart(cart);
    dispatch(updateUserCart(cartItems));
    return cartItemId;
    }
    catch (error) {
      console.error("Error finding cartItemss", error);
      throw error;
    }
  };

  
  const findCartByUserId = async (userId) => {
    const cartsRef = ref(db, "ShoppingCarts"); 
    const cartQuery = query(cartsRef, equalTo("user_id", userId))
    try {
      const snapshot = await get(cartsRef);
      if (snapshot.exists()) {
        const allCarts = snapshot.val();
        const cart = Object.values(allCarts).filter(
          (cart) => cart.user_id === userId
         )[0];
         return cart;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding cart by user ID:", error);
      throw error;
    }
  };

  
  const createNewCart = async (userId) => {
    try {
      const cartsRef = ref(db, "ShoppingCarts");
      const newCartRef = push(cartsRef);
      const newCartKey = newCartRef.key;
      const newCart = {
        id: newCartKey,
        user_id: userId,
      };
      await set(newCartRef, newCart);
      return newCartKey;
    } catch (error) {
      console.error("Error creating a new cart:", error);
      throw error;
    }
  };

  

  const findCartItemsBasedOnCart = async (cartId) => {
    try {
      const cartItemsRef = ref(db, "ShoppingCartItems");
      const snapshot = await get(cartItemsRef);
      if (snapshot.exists()) {
        let cartItems = snapshot.val();
        const cartItemsArray = Object.values(cartItems); 
        return cartItemsArray;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding  cart items:", error);
      throw error;
    }
  };
  
  const addToExistingCart = async (cartId, productId, noOfItems, selectedVariant) => {
    try {
      const cartItemsRef = ref(db, "ShoppingCartItems");
      const snapshot = await get(cartItemsRef);
      if (snapshot.exists()) {
        let cartItems = snapshot.val();
        const cartItemsArray = Object.values(cartItems); 
        const existingItem = cartItemsArray.find((item) => 
        item.cart_id === cartId && item.product_id === productId
        );
        if (existingItem) {
          existingItem.quantity += noOfItems;
          await set(ref(db, `ShoppingCartItems/${existingItem.id}`), existingItem);
          return existingItem.id;
        }
      }
      const newCartItemRef = push(cartItemsRef); 
      const newCartItemKey = newCartItemRef.key;
      const newCartItem = {
        id: newCartItemKey,
        cart_id: cartId,
        product_id: productId,
        parent_product_id:item.id,
        quantity: noOfItems,
        images:item.images,
        name:item.name,
        price:selectedVariant.price,
        variant_quantity:selectedVariant.quantity,
        variant_name:selectedVariant.variant_name
      };
      await set(newCartItemRef, newCartItem);
      return newCartItemKey;
    } catch (error) {
      console.error("Error adding a cart item:", error);
      throw error;
    }
  };
  
  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item.src }} />
      </View>
    </TouchableHighlight>
  );
  
  
  return (
    <View>
     {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
        {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
          <ScrollView style={styles.container}>
            <View style={styles.carouselContainer}>
              <View style={styles.carousel}>
                <Carousel
                  ref={slider1Ref}
                  data={item.images}
                  renderItem={renderImage}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  firstItem={0}
                  loop={false}
                  autoplay={false}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => setActiveSlide(0)}
                />
                <Pagination
                  dotsLength={item.images.length}
                  activeDotIndex={activeSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor="rgba(0, 0, 0, 0.92)"
                  dotStyle={styles.paginationDot}
                  inactiveDotColor="white"
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={slider1Ref.current}
                  tstateableDots={!!slider1Ref.current}
                />
              </View>
            </View>
            <View style={styles.infoProductContainer}>
              <Text style={styles.infoProductName}>{item.name}</Text>
              <View style={styles.infoContainer}>
                <TouchableHighlight underlayColor='rgba(73,182,77,0.9)'>
                <View style={styles.btncontainer}>
                  <Text style={styles.btntext} onPress={showVariantSelection}>Add to Cart</Text>
                </View>
            </TouchableHighlight>
              </View>
              <View style={styles.infoContainer}>
                <ScrollView>
                {productReviews.length > 0 ? (
                    <StarRating
                      style={{marginLeft:50,marginTop:30,marginBottom:30,justifyContent:'center'}}
                      maxStars={5}
                      rating={rating}
                      enableHalfStar={false}
                      size={100}
                      activeColor="#FFD700"
                      onChange={()=>{return false}}
                    />):(
                      <Text style={{marginLeft:80,marginTop:30,marginBottom:30,justifyContent:'center'}}>No reviews available yet.</Text>
                )}
                <Text style={styles.category}>Description</Text>
                  <Text style={styles.infoDescriptionProduct}>
                    <HTML source={{ html: item.description }} contentWidth={contentWidth}/>
                  </Text>
                </ScrollView>
              </View>
              {productReviews.length > 0 ? (
              <View style={styles.reviewsContainer}>
                <Text style={styles.category}>Reviews : <Text style={styles.rating}>{rating}/5</Text></Text>
                
                 
                  <View style={styles.reviewsContainer}>
                    <Text style={styles.category}>Reviews : <Text style={styles.rating}>{rating}/5</Text></Text>
                    {productReviews.map((review) => (
                      <ReviewItem
                        key={review.id}
                        reviewerName={review.user_name}
                        rating={review.rating}
                        reviewText={review.review_text}
                      />
                     ))}
                    </View>
                  
              </View>):null}
            </View>
          
          </ScrollView>
          <VariantSelectionScreen
              isVisible={isVariantSelectionVisible}
              onDone={handleVariantSelectionDone}
              onClose={onVariantSelectionClose}
              variants={itemVariants}
          />
        </View>)}
    </View>
  );
}
