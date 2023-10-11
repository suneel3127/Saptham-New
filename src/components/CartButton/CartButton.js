import React ,{useEffect,useState}from "react";
import { TouchableHighlight, View, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, get,set, push } from "firebase/database";
import { emptyCart } from "../../redux/slice";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping';

export default function CartButton(props) {

  const [cartItemsCount, setCartItemsCount] = useState(0);
  const user = useSelector((app) => app.state.userDetails);
  const db = getDatabase();
  const dispatch = useDispatch();
  let cartItemsAnonymous = useSelector((app) => app.state.cartItems);
  let userCart = useSelector((app) => app.state.userCart);

  useEffect(() => {
    fetchCartItemsCount();
  }, [user, cartItemsAnonymous, userCart]);

  const fetchCartItemsCount = async () => {
    if (user) {
      findCartItems(user.id)
        .then((cartItems) => {
          setCartItemsCount(cartItems.length);
        })
        .catch((error) => {
          console.error("Error finding cart items", error);
        });
    } else {
      setCartItemsCount(cartItemsAnonymous.length);
    }
  };

  

  const findCartItems = async (userId) => {
    const existingCart = await findCartByUserId(userId);
    if (existingCart) {
      if(cartItemsAnonymous.length>0){
        const addToCartPromises = cartItemsAnonymous.map(async (item) => {
          await addToExistingCart(item, existingCart.id);
        });
        await Promise.all(addToCartPromises);
        dispatch(emptyCart())
      }
      const cartItems = await findCartItemsBasedOnCart(existingCart.id);
      return cartItems;
    } else {
      return [];
    }
  };

  const findCartByUserId = async (userId) => {
    const cartsRef = ref(db, "ShoppingCarts"); 
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

  const addToExistingCart = async (newItem, cartId) => {
    try {
      const cartItemsRef = ref(db, "ShoppingCartItems");
      const snapshot = await get(cartItemsRef);
      if (snapshot.exists()) {
        let cartItems = snapshot.val();
        const cartItemsArray = Object.values(cartItems); 
        const existingItem = cartItemsArray.find((item) => 
        item.cart_id === cartId && item.product_id === newItem.id
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
          await set(ref(db, `ShoppingCartItems/${existingItem.id}`), existingItem);
          return existingItem.id;
        }
      }
      const newCartItemRef = push(cartItemsRef);
      const newCartItemKey = newCartItemRef.key;
      const newCartItem = {
        id: newCartItemKey,
        cart_id: cartId,
        product_id: newItem.id,
        parent_product_id:newItem.id,
        quantity: newItem.quantity,
        images:newItem.images,
        name:newItem.name,
        price:newItem.price,
        variant_quantity:newItem.variant_quantity,
        variant_name:newItem.variant_name
      };
      await set(newCartItemRef, newCartItem);
    } catch (error) {
      console.error("Error adding a cart item:", error);
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


  return (
    <View>
    <View style={styles.cartItemCount}>
            <Text style={styles.cartItemCountText} >{cartItemsCount}</Text>
    </View>
    <TouchableHighlight onPress={props.onPress} >
     <FontAwesomeIcon icon={faCartShopping} style={styles.btnIcon}/>
    </TouchableHighlight>
    </View>
  );
}

CartButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
