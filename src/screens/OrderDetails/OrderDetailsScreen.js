import React, { useState,useLayoutEffect, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./styles";
import { getDatabase, ref, get} from "firebase/database";
import Toast from '../../components/Toast/Toast';
import OrderItem from "./OrderItem";

export default function OrderDetailsScreen(props) {
  const { navigation, route } = props;
  const order = route.params?.item;
  const user = route.params?.user;
  const navigationPage = route.params?.navigationPage;
  const db = getDatabase();
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigationPage=="checkout"?navigation.navigate('Home'):navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  useEffect(() => {
      findOrderItems(order.id)
  }, []);

  const findOrderItems = async (orderId) =>{
    const orderItemsRef = ref(db, 'OrderItems');
    try {
        const snapshot = await get(orderItemsRef);
        if (snapshot.exists()) {
          const allOrderItems = snapshot.val();
          const filteredOrderItems = Object.values(allOrderItems).filter((orderItem) => orderItem.order_id === orderId);
          setOrderItems(filteredOrderItems);
        } else {
          showToast("No order items found in the database.","error");
          setOrderItems([])
        }
       
      } catch (error) {
        showToast("Error fetching order items:", 'error');
        throw error;
      }
      setIsLoading(false);
  }
  

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
    setTimeout(() => {
        setToast(null);
      }, 1000);
  };

  

  const calculateTotalPrice = () => {
    const totalPrice = Math.round(orderItems.reduce((total, item) => total + (item.unit_price*item.quantity), 0));
    return totalPrice;
  };
  const navigateToReview = (item)=>{
    navigation.navigate('Review',{item,user})
  }

  return (
    <View style={{ flex: 1, padding: 16 , backgroundColor:'white'}}>

      {
        isLoading?
          <ActivityIndicator /> 
        :navigationPage=="checkout"?
        <View>
        <Text style={{marginLeft:70,color:'green',fontSize:15, marginBottom:30}}>
        Your order has been confirmed!
        </Text>
        
        <FlatList
          data={orderItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderItem
              item={item}
              navigateToReview={navigateToReview}
              navigationPage={navigationPage}
            />
          )}
        /></View>:<FlatList
          data={orderItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderItem
              item={item}
              navigateToReview={navigateToReview}
            />
          )}
        />
      }
      

      {!isLoading && orderItems.length > 0 && (
        <View>
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryHeading}>Order Summary</Text>
            <View style={styles.summaryItem}>
              <Text>Subtotal:</Text>
              <Text>{calculateTotalPrice().toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text>Taxes:</Text>
              <Text>0</Text>
            </View> 
           <View style={styles.summaryItem}>
              <Text>Shipping:</Text>
              <Text>0</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text>Discounts:</Text>
              <Text>-0</Text>
            </View>
            <View style={styles.summaryTotal}>
              <Text>Total:</Text>
              <Text>{calculateTotalPrice().toFixed(2)}</Text>
            </View>
          </View>
          
        </View>
      )}
      
        {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
    </View>
  );
}