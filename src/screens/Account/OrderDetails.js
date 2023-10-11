import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import styles from './styles';
import { getDatabase, ref, set, get } from "firebase/database";
import BackButton from "../../components/BackButton/BackButton";




const OrderDetails = (props) => {
  const { navigation,route } = props;
  const user =  route.params?.user;
  const [orders,setOrders] = useState([])
  const db = getDatabase();

  useEffect(() => {
    const fetchOrdersData = async () => {
          const ordersRef = ref(db, 'Orders/');
          try {
            const allOrdersSnapshot = await get(ordersRef); 
            if (allOrdersSnapshot.exists()) {
              const allOrders = allOrdersSnapshot.val();
              const userOrders = Object.values(allOrders).filter(
                (order) => order.user_id === user.id
               );
               setOrders(userOrders);
            }
          } catch (error) {
            console.error('Error fetching orders data:', error);
          }
        } 
        fetchOrdersData();
  }, []);

  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.navigate("Account", { key: Math.random() }); 
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substr(0, maxLength) + '...';
    }
  };

  const renderOrders = () => {
    return (
      <View >
        {orders?.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.orderItem} onPress={()=>{navigation.navigate("Order Details", { item,user })}}>
              <View style={styles.leftOrderContainer}>
                <Text style={styles.orderName}>
                  {truncateText(item.order_name, 15)}
                </Text>
                <Text style={styles.orderDetailsLeft}># {item.id}</Text>
                <Text style={styles.orderDetailsLeft}>
                {new Date(item.order_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })}
                </Text>
              </View>
              <View style={styles.rightOrderContainer}>
                <Text style={styles.orderDetailsRight}>
                  ₹ {(item.total_amount / 100).toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.orderDetailsRight,
                    { marginLeft: 10 },
                      item.order_status === 'Payment Pending'?
                      styles.pendingStatus
                      :item.order_status === 'Payment Failed'?
                      styles.failedStatus
                      :item.order_status === 'Ordered'
                      ? styles.orderedStatus
                      : item.order_status === 'Delivered'
                      ? styles.deliveredStatus
                      : null,
                  ]}
                >
                  {item.order_status}
                </Text>
              </View>
            </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No orders found.</Text>
        )}
      </View>
    );
  };

  

  return (
    <View style={styles.maincontainer}>
     {renderOrders()}
    </View>
  );
};

export default OrderDetails;
